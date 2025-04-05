import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { BusinessPlan, IBusinessPlan } from "@/models/BusinessPlan";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");

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
    const businessPlan = await BusinessPlan.findOne({
      _id: planId,
      userId: session.user.id,
    }).lean();

    if (!businessPlan) {
      return NextResponse.json(
        { error: "Business plan not found" },
        { status: 404 }
      );
    }

    const typedBusinessPlan = businessPlan as unknown as IBusinessPlan;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Extract relevant sections from the business plan
    const financialSection = typedBusinessPlan.sections?.financialProjections?.content || '';
    const marketSection = typedBusinessPlan.sections?.marketAnalysis?.content || '';
    const operationsSection = typedBusinessPlan.sections?.operations?.content || '';

    const prompt = `Based on the following business plan details, generate a detailed financial forecast. 
    Format the response as a valid JSON object without any markdown formatting or additional text.

Business Details:
Name: ${typedBusinessPlan.businessName}
Industry: ${typedBusinessPlan.industry}
Target Market: ${typedBusinessPlan.targetMarket}

Financial Information:
${financialSection}

Market Analysis:
${marketSection}

Operations:
${operationsSection}

Generate a JSON response with this exact structure:
{
  "startupCosts": {
    "totalAmount": number,
    "breakdown": {
      "equipment": number,
      "licenses": number,
      "initialInventory": number,
      "marketing": number,
      "workingCapital": number,
      "others": number
    }
  },
  "monthlyProjections": {
    "revenue": {
      "amounts": number[],
      "sources": {
        "productSales": number,
        "services": number,
        "other": number
      }
    },
    "expenses": {
      "amounts": number[],
      "breakdown": {
        "rawMaterials": number,
        "labor": number,
        "utilities": number,
        "rent": number,
        "marketing": number,
        "others": number
      }
    }
  },
  "keyMetrics": {
    "breakEvenPoint": {
      "months": number,
      "amount": number
    },
    "profitMargin": number,
    "roi": number,
    "paybackPeriod": number
  },
  "fundingNeeds": {
    "totalRequired": number,
    "recommendedSources": [
      {
        "source": string,
        "amount": number,
        "type": string,
        "terms": string
      }
    ]
  }
}

Important:
1. All amounts should be in Indian Rupees (INR)
2. Ensure the response is a valid JSON object
3. Do not include any explanatory text or markdown formatting
4. Base calculations on typical Indian market rates and conditions
5. Consider local costs and market standards for the specific industry`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    try {
      // Remove any potential markdown formatting or extra text
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonText = text.slice(jsonStart, jsonEnd);
      
      const forecast = JSON.parse(jsonText);
      
      // Validate the structure of the response
      if (!forecast.startupCosts || !forecast.monthlyProjections || !forecast.keyMetrics || !forecast.fundingNeeds) {
        throw new Error("Invalid forecast structure");
      }

      return NextResponse.json({ 
        message: "Forecast generated successfully",
        forecast 
      });
    } catch (error) {
      console.error("Forecast parsing error:", error);
      return NextResponse.json(
        { error: "Failed to generate valid forecast" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error generating forecast:", error);
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    );
  }
} 