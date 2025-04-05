import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { ComplianceItem } from "@/models/ComplianceItem";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";

// Initialize Gemini AI with proper error handling
const initGeminiAI = () => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI_API_KEY environment variable is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { businessType, state } = await req.json();
    
    if (!businessType || !state) {
      return NextResponse.json(
        { error: "Business type and state are required" },
        { status: 400 }
      );
    }

    await connectDB();
    
    try {
      // First check if we already have compliance items for this business type and state
      const existingItems = await ComplianceItem.find({
        status: "active",
        $and: [
          {
            $or: [
              { applicableBusinessTypes: businessType },
              { applicableBusinessTypes: "All" }
            ]
          },
          {
            $or: [
              { applicableStates: state },
              { applicableStates: "All" }
            ]
          }
        ]
      });
      
      // If we already have items, return them instead of generating new ones
      if (existingItems.length > 0) {
        // Update the user's business profile
        const user = await User.findById(session.user.id);
        if (user) {
          if (!user.businessProfile) {
            user.businessProfile = {};
          }
          user.businessProfile.type = businessType;
          user.businessProfile.state = state;
          await user.save();
        }
        
        return NextResponse.json({ 
          success: true,
          items: existingItems,
          message: "Found existing compliance items",
          isExisting: true
        });
      }
      
      const genAI = initGeminiAI();
      
      // Set up the model with safety settings
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      const prompt = `Generate 5-7 compliance requirements for a ${businessType} business in ${state}, India.
Please provide the details in the following JSON format:

[
  {
    "title": "Requirement name",
    "description": "Brief description of the requirement",
    "category": "Category (e.g., Taxation, Registration, Labor Compliance, Industry-Specific, etc.)",
    "priority": "high/medium/low",
    "applicableBusinessTypes": ["${businessType}"],
    "applicableStates": ["${state}"],
    "dueDate": "YYYY-MM-DD (if applicable, otherwise null)",
    "link": "Official website URL for this requirement",
    "status": "active",
    "steps": [
      {
        "order": 1,
        "description": "First step description",
        "estimatedTime": "Estimated time to complete (e.g., '1-2 days')"
      },
      {
        "order": 2,
        "description": "Second step description",
        "estimatedTime": "Estimated time"
      }
    ],
    "fees": {
      "amount": Fee amount in INR (numeric, no currency symbol),
      "description": "Description of the fee"
    },
    "helpfulLinks": [
      {
        "title": "Link title",
        "url": "URL to helpful resource"
      }
    ]
  }
]

Focus on important legal and tax compliance requirements like:
1. Business registration (e.g., Shop and Establishment Act)
2. Tax registrations (GST, Income Tax, Professional Tax)
3. Labor law compliances (PF, ESI, etc.)
4. Industry-specific licenses for ${businessType} businesses
5. Local municipal permits required in ${state}

Make sure the applicableBusinessTypes array includes only "${businessType}" (not "All") and applicableStates includes only "${state}" (not "All") to ensure these items are specific to this business type and location.

For each item, provide accurate, realistic and actionable information relevant to India. Use real links to government portals where applicable.`;

      // Generate content with a timeout
      const generatePromiseWithTimeout = Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("AI request timed out after 30 seconds")), 30000)
        )
      ]);
      
      const result = await generatePromiseWithTimeout as any;
      const response = result.response;
      const text = response.text();
      
      let complianceItems;
      try {
        // Try to parse the JSON response, with some cleaning if needed
        const cleanText = text.trim().replace(/```json|```/g, '').trim();
        complianceItems = JSON.parse(cleanText);
        
        if (!Array.isArray(complianceItems)) {
          throw new Error("Response is not an array");
        }
        
        // Ensure each item has the correct business type and state
        complianceItems = complianceItems.map(item => {
          // Make sure applicableBusinessTypes includes the selected business type
          if (!item.applicableBusinessTypes || !item.applicableBusinessTypes.includes(businessType)) {
            item.applicableBusinessTypes = [businessType];
          }
          
          // Make sure applicableStates includes the selected state
          if (!item.applicableStates || !item.applicableStates.includes(state)) {
            item.applicableStates = [state];
          }
          
          return item;
        });
        
        // Insert generated items into the database
        const savedItems = await ComplianceItem.insertMany(complianceItems);
        
        // Get the user and update their business profile
        const user = await User.findById(session.user.id);
        if (user) {
          if (!user.businessProfile) {
            user.businessProfile = {};
          }
          user.businessProfile.type = businessType;
          user.businessProfile.state = state;
          await user.save();
        }
        
        return NextResponse.json({ 
          success: true,
          items: savedItems,
          message: "Generated and saved compliance items successfully" 
        });
      } catch (error) {
        console.error("Error parsing AI response for compliance items:", text, error);
        return NextResponse.json(
          { error: "Failed to parse compliance items from AI response" },
          { status: 500 }
        );
      }
    } catch (aiError: any) {
      console.error("AI error:", aiError);
      return NextResponse.json(
        { error: `AI error: ${aiError.message || "Unknown AI error"}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating compliance items:", error);
    return NextResponse.json(
      { error: `Failed to generate compliance items: ${error.message}` },
      { status: 500 }
    );
  }
} 