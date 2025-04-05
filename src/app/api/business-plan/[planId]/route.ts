import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessPlan } from "@/models/BusinessPlan";
import connectDB from "@/lib/mongodb";

export async function DELETE(
  req: Request,
  { params }: { params: { planId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please log in to access this resource" },
        { status: 401 }
      );
    }

    await connectDB();

    // Find and delete the business plan
    const plan = await BusinessPlan.findOneAndDelete({
      _id: params.planId,
      userId: session.user.id,
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Not Found", message: "Business plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Business plan deleted successfully" });
  } catch (error) {
    console.error("Delete business plan error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: "Failed to delete business plan" },
      { status: 500 }
    );
  }
} 