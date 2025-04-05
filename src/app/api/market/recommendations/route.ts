import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BusinessPlan } from "@/models/BusinessPlan";
import { MarketPlace } from "@/models/MarketPlace";
import connectDB from "@/lib/mongodb";
import { MarketData } from "@/models/MarketData";

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
    
    // Fetch marketplace data with a mutable variable
    let marketplaces = await MarketPlace.find({ status: "active" }).lean();

    // If no marketplaces found, try to initialize them
    if (!marketplaces.length) {
      try {
        // Initialize sample marketplaces
        const sampleMarketplaces = [
          {
            name: "Flipkart",
            description: "India's leading e-commerce marketplace with millions of active customers",
            logo: "https://logo.clearbit.com/flipkart.com",
            website: "https://seller.flipkart.com",
            industries: ["Retail", "Electronics", "Fashion", "Home & Living"],
            productTypes: ["Physical Products", "Electronics", "Clothing", "Accessories"],
            targetMarket: ["B2C", "Pan India"],
            commissionRate: 15,
            averageRating: 4.2,
            reviewCount: 15000,
            features: [
              {
                title: "Smart Logistics",
                description: "End-to-end logistics support with Ekart integration"
              },
              {
                title: "Payment Protection",
                description: "Secure payment gateway with quick settlement cycles"
              }
            ],
            requirements: [
              {
                title: "Business Registration",
                description: "Valid GST registration and business PAN required"
              }
            ],
            status: "active"
          },
          {
            name: "Amazon India",
            description: "Global e-commerce platform with extensive reach and advanced seller tools",
            logo: "https://logo.clearbit.com/amazon.in",
            website: "https://sell.amazon.in",
            industries: ["Retail", "Electronics", "Books", "Fashion"],
            productTypes: ["Physical Products", "Digital Products", "Books"],
            targetMarket: ["B2C", "Pan India"],
            commissionRate: 18,
            averageRating: 4.5,
            reviewCount: 20000,
            features: [
              {
                title: "FBA",
                description: "Fulfillment by Amazon for hassle-free delivery"
              }
            ],
            status: "active"
          }
        ];
        
        await MarketPlace.insertMany(sampleMarketplaces);
        
        // Retry fetching marketplaces
        const refreshedMarketplaces = await MarketPlace.find({ status: "active" }).lean();
        
        if (refreshedMarketplaces.length) {
          // Use the refreshed marketplace data
          marketplaces = refreshedMarketplaces;
        } else {
          // Still no marketplace data, return error
          return NextResponse.json(
            { error: "No marketplace data available" },
            { status: 500 }
          );
        }
      } catch (initError) {
        console.error("Failed to initialize marketplace data:", initError);
        return NextResponse.json(
          { error: "No marketplace data available and failed to initialize" },
          { status: 500 }
        );
      }
    }

    // Score each marketplace based on business plan compatibility
    const scoredMarketplaces = marketplaces.map((marketplace: any) => {
      let score = 0;
      
      // Industry match
      if (marketplace.industries?.includes(businessPlan.industry)) {
        score += 30;
      }

      // Product type match
      if (marketplace.productTypes?.some((type: string) => 
        businessPlan.productsServices?.toLowerCase().includes(type.toLowerCase())
      )) {
        score += 25;
      }

      // Target market overlap
      if (marketplace.targetMarket?.some((market: string) => 
        businessPlan.targetMarket?.toLowerCase().includes(market.toLowerCase())
      )) {
        score += 20;
      }

      // Consider marketplace rating
      score += (marketplace.averageRating || 0) * 5;

      return {
        _id: marketplace._id,
        name: marketplace.name,
        logo: marketplace.logo,
        website: marketplace.website,
        features: marketplace.features?.slice(0, 3) || [],
        averageRating: marketplace.averageRating,
        commissionRate: marketplace.commissionRate,
        matchScore: Math.round(score),
        reasons: [
          score >= 75 ? "Excellent match for your business type and products" :
          score >= 50 ? "Good potential fit with some alignment to your business" :
          "Potential opportunity but may require adaptation",
          marketplace.industries?.includes(businessPlan.industry) 
            ? "Industry-specific platform" 
            : "Diverse marketplace accepting various industries",
          `Platform rating: ${marketplace.averageRating?.toFixed(1) || "N/A"}/5`,
          `Commission rate: ${marketplace.commissionRate}%`
        ]
      };
    });

    // Sort by match score and rating
    const recommendationsData = scoredMarketplaces
      .sort((a, b) => b.matchScore - a.matchScore || (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5); // Top 5 recommendations

    // Save/Update data in MongoDB
    const savedData = await MarketData.findOneAndUpdate(
      { userId: session.user.id, planId: planId, tabType: "recommendations" },
      { $set: { data: { recommendations: recommendationsData } } },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: savedData.data });

  } catch (error) {
    console.error("Error generating marketplace recommendations:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
} 