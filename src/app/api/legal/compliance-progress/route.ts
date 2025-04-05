import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ComplianceItem } from "@/models/ComplianceItem";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(req.url);
    const businessType = searchParams.get("businessType") || user.businessProfile?.type || "Other";
    const state = searchParams.get("state") || user.businessProfile?.state || "All";

    // If businessType and state provided, update the user's profile
    if (searchParams.has("businessType") || searchParams.has("state")) {
      if (searchParams.get("businessType")) {
        if (!user.businessProfile) {
          user.businessProfile = {};
        }
        user.businessProfile.type = businessType;
      }
      
      if (searchParams.get("state")) {
        if (!user.businessProfile) {
          user.businessProfile = {};
        }
        user.businessProfile.state = state;
      }
      
      await user.save();
    }

    const items = await ComplianceItem.find({
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
    }).sort({ priority: -1 });

    return NextResponse.json({
      items,
      completedItems: user.completedComplianceItems || [],
      businessType,
      state
    });
  } catch (error) {
    console.error("Error fetching compliance items:", error);
    return NextResponse.json(
      { error: "Failed to fetch compliance items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { itemId, completed } = await req.json();

    await connectDB();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.completedComplianceItems) {
      user.completedComplianceItems = [];
    }

    if (completed) {
      if (!user.completedComplianceItems.includes(itemId)) {
        user.completedComplianceItems.push(itemId);
      }
    } else {
      user.completedComplianceItems = user.completedComplianceItems.filter(
        (id) => id !== itemId
      );
    }

    await user.save();

    return NextResponse.json({
      completedItems: user.completedComplianceItems
    });
  } catch (error) {
    console.error("Error updating compliance progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
} 