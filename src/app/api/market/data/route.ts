import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MarketData } from "@/models/MarketData";
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

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");
    const tabType = searchParams.get("tabType");

    if (!planId || !tabType) {
      return NextResponse.json(
        { error: "planId and tabType are required" },
        { status: 400 }
      );
    }

    if (!["analysis", "recommendations", "strategies"].includes(tabType)) {
       return NextResponse.json(
        { error: "Invalid tabType" },
        { status: 400 }
      );
    }

    await connectDB();

    const marketData = await MarketData.findOne({
      userId: session.user.id,
      planId,
      tabType,
    });

    if (!marketData) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    return NextResponse.json({ data: marketData.data }, { status: 200 });

  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data" },
      { status: 500 }
    );
  }
} 