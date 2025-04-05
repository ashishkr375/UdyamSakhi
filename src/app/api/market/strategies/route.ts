import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { BusinessPlan } from "@/models/BusinessPlan";
import connectDB from "@/lib/mongodb";
import { MarketData } from "@/models/MarketData";

// Initialize Gemini API with proper error handling
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

    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json(
        { error: "Business plan ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const businessPlan = await BusinessPlan.findById(planId);
    if (!businessPlan || businessPlan.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: "Business plan not found or unauthorized" },
        { status: 404 }
      );
    }

    try {
      const genAI = initGeminiAI();
      
      // Set up the model with safety settings
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
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

      const prompt = `Based on the following business plan, provide detailed market growth strategies and recommendations. Focus on practical, actionable steps for the Indian market.

Business Plan Details:
- Business Name: ${businessPlan.businessName || "N/A"}
- Industry: ${businessPlan.industry || "N/A"}
- Target Market: ${businessPlan.targetMarket || "N/A"}
- Products/Services: ${businessPlan.productsServices || "N/A"}
- USP: ${businessPlan.uniqueValue || "N/A"}
- Current Challenges: ${businessPlan.challenges || "N/A"}

Please provide strategies in the following JSON format:
{
  "shortTerm": {
    "marketingStrategies": ["list of immediate marketing actions"],
    "salesStrategies": ["list of immediate sales actions"],
    "channelStrategies": ["list of distribution channels to focus on"],
    "estimatedCosts": {
      "marketing": "estimated marketing budget in INR",
      "sales": "estimated sales budget in INR",
      "channels": "estimated channel development budget in INR"
    },
    "expectedOutcomes": ["list of expected results in 3-6 months"]
  },
  "longTerm": {
    "expansionStrategies": ["list of market expansion strategies"],
    "productStrategies": ["list of product development strategies"],
    "partnershipStrategies": ["list of potential partnership opportunities"],
    "investmentRequired": {
      "total": "estimated total investment needed in INR",
      "breakdown": {
        "expansion": "expansion cost in INR",
        "product": "product development cost in INR",
        "partnerships": "partnership development cost in INR"
      }
    },
    "expectedOutcomes": ["list of expected results in 1-2 years"]
  },
  "keyMetrics": ["list of KPIs to track"],
  "riskMitigation": [
    "risk statement 1", 
    "risk statement 2",
    // OR you can use this structure for more detailed risk mitigation:
    {
      "risk": "specific risk description",
      "mitigation": "specific mitigation strategy"
    }
  ]
}

Important: For the "riskMitigation" array, you can either provide simple string items OR objects with "risk" and "mitigation" properties, but be consistent in your response.

Ensure the response is a valid JSON object. Do not include any text outside the JSON structure.`;

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
      
      let strategiesData;
      try {
        // Try to parse the JSON response, with some cleaning if needed
        const cleanText = text.trim().replace(/```json|```/g, '').trim();
        strategiesData = JSON.parse(cleanText);
        
        // Normalize riskMitigation format to ensure consistent structure
        if (strategiesData.riskMitigation) {
          strategiesData.riskMitigation = strategiesData.riskMitigation.map((item: any) => {
            // If the item is already a string, return it as is
            if (typeof item === 'string') {
              return item;
            }
            
            // If it's an object with risk and mitigation properties, format it properly
            if (typeof item === 'object' && item !== null) {
              if ('risk' in item && 'mitigation' in item) {
                return {
                  risk: item.risk,
                  mitigation: item.mitigation
                };
              }
              
              // If it's some other object structure, convert to string
              return JSON.stringify(item);
            }
            
            // Default case
            return String(item);
          });
        }
      } catch (error) {
        console.error("Error parsing AI response for strategies:", text, error);
        return NextResponse.json(
          { error: "Failed to parse growth strategies from AI. The response was not valid JSON." },
          { status: 500 }
        );
      }

      // Save/Update data in MongoDB
      const savedData = await MarketData.findOneAndUpdate(
        { userId: session.user.id, planId: planId, tabType: "strategies" },
        { $set: { data: strategiesData } },
        { new: true, upsert: true }
      );

      return NextResponse.json({ success: true, data: savedData.data });
      
    } catch (aiError: any) {
      console.error("AI error:", aiError);
      return NextResponse.json(
        { error: `AI error: ${aiError.message || "Unknown AI error"}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error generating growth strategies:", error);
    return NextResponse.json(
      { error: `Failed to generate growth strategies: ${error.message}` },
      { status: 500 }
    );
  }
} 