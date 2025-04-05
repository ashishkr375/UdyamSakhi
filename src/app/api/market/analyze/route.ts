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

      const prompt = `Analyze the following business plan and provide a detailed market analysis. Focus on market opportunities, competition, and growth potential in India.

Business Plan Details:
- Business Name: ${businessPlan.businessName || "N/A"}
- Industry: ${businessPlan.industry || "N/A"}
- Target Market: ${businessPlan.targetMarket || "N/A"}
- Products/Services: ${businessPlan.productsServices || "N/A"}
- Competition: ${businessPlan.competition || "N/A"}
- Market Size: ${businessPlan.marketSize || "N/A"}

Please provide analysis in the following JSON format:
{
  "marketSize": {
    "current": "estimated current market size in INR",
    "potential": "potential market size in 5 years",
    "growthRate": "expected annual growth rate"
  },
  "competitiveLandscape": {
    "directCompetitors": ["list of direct competitors"],
    "indirectCompetitors": ["list of indirect competitors"],
    "competitiveAdvantages": ["your competitive advantages"]
  },
  "marketOpportunities": ["list of key market opportunities"],
  "marketThreats": ["list of potential threats"],
  "recommendations": ["specific recommendations for market entry and growth"]
}

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
      
      let analysisData;
      try {
        // Try to parse the JSON response, with some cleaning if needed
        const cleanText = text.trim().replace(/```json|```/g, '').trim();
        analysisData = JSON.parse(cleanText);
      } catch (error) {
        console.error("Error parsing AI response for analysis:", text, error);
        return NextResponse.json(
          { error: "Failed to parse market analysis from AI. The response was not valid JSON." },
          { status: 500 }
        );
      }

      // Save/Update data in MongoDB
      const savedData = await MarketData.findOneAndUpdate(
        { userId: session.user.id, planId: planId, tabType: "analysis" },
        { $set: { data: analysisData } },
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
    console.error("Error generating market analysis:", error);
    return NextResponse.json(
      { error: `Failed to generate market analysis: ${error.message}` },
      { status: 500 }
    );
  }
} 