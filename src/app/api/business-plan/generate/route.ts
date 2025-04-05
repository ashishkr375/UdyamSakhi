import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessPlan } from "@/models/BusinessPlan";
import connectDB from "@/lib/mongodb";
import { generateEntireBusinessPlan } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { businessName, industry, businessIdea, targetMarket } = await req.json();

    if (!businessName || !industry || !businessIdea || !targetMarket) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate business plan sections using AI
    const generatedSections = await generateEntireBusinessPlan({
      businessName,
      industry,
      businessIdea,
      targetMarket,
    });

    // Create business plan in database
    const businessPlan = await BusinessPlan.create({
      userId: session.user.id,
      businessName,
      industry,
      businessIdea,
      targetMarket,
      sections: {
        executiveSummary: {
          content: generatedSections.executiveSummary,
          lastUpdated: new Date(),
          version: 1,
        },
        marketAnalysis: {
          content: generatedSections.marketAnalysis,
          lastUpdated: new Date(),
          version: 1,
        },
        operations: {
          content: generatedSections.operations,
          lastUpdated: new Date(),
          version: 1,
        },
        marketing: {
          content: generatedSections.marketing,
          lastUpdated: new Date(),
          version: 1,
        },
        financialProjections: {
          content: generatedSections.financialProjections,
          lastUpdated: new Date(),
          version: 1,
        },
      },
      status: "generated",
      versionHistory: [{
        version: 1,
        updatedAt: new Date(),
        changes: "Initial plan generation",
      }],
    });

    return NextResponse.json({
      message: "Business plan generated successfully",
      plan: businessPlan,
    }, { status: 201 });
  } catch (error) {
    console.error("Business plan generation error:", error);
    return NextResponse.json(
      { message: "Error generating business plan" },
      { status: 500 }
    );
  }
} 