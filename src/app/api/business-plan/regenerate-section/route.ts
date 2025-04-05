import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessPlan } from "@/models/BusinessPlan";
import connectDB from "@/lib/mongodb";
import { generateBusinessPlanSection } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { planId, section } = await req.json();

    if (!planId || !section) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the business plan and verify ownership
    const businessPlan = await BusinessPlan.findOne({
      _id: planId,
      userId: session.user.id,
    });

    if (!businessPlan) {
      return NextResponse.json(
        { message: "Business plan not found" },
        { status: 404 }
      );
    }

    // Generate new content for the section
    const newContent = await generateBusinessPlanSection(
      section as any,
      {
        businessName: businessPlan.businessName,
        industry: businessPlan.industry,
        businessIdea: businessPlan.businessIdea,
        targetMarket: businessPlan.targetMarket,
      }
    );

    // Update the section
    const currentVersion = businessPlan.sections[section].version;
    businessPlan.sections[section] = {
      content: newContent,
      lastUpdated: new Date(),
      version: currentVersion + 1,
    };

    // Add to version history
    businessPlan.versionHistory.push({
      version: currentVersion + 1,
      updatedAt: new Date(),
      changes: `Regenerated ${section} section`,
    });

    await businessPlan.save();

    return NextResponse.json({
      message: "Section regenerated successfully",
      section: businessPlan.sections[section],
    });
  } catch (error) {
    console.error("Section regeneration error:", error);
    return NextResponse.json(
      { message: "Error regenerating section" },
      { status: 500 }
    );
  }
} 