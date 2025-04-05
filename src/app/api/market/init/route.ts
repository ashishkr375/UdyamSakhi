import { NextResponse } from "next/server";
import { MarketPlace } from "@/models/MarketPlace";
import connectDB from "@/lib/mongodb";

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
      },
      {
        title: "Quality Standards",
        description: "Products must meet Flipkart's quality guidelines"
      }
    ],
    onboardingSteps: [
      {
        order: 1,
        title: "Registration",
        description: "Complete the seller registration form"
      },
      {
        order: 2,
        title: "Documentation",
        description: "Submit business and tax documents"
      }
    ],
    supportedRegions: ["All India"],
    paymentMethods: ["Bank Transfer", "UPI"],
    shippingOptions: ["Flipkart Assured", "Standard Delivery"],
    minimumOrderValue: 0,
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
      },
      {
        title: "Prime Badge",
        description: "Eligibility for Amazon Prime and faster delivery"
      }
    ],
    requirements: [
      {
        title: "Business Verification",
        description: "Valid GST and business documentation required"
      },
      {
        title: "Quality Check",
        description: "Products must pass Amazon's quality standards"
      }
    ],
    onboardingSteps: [
      {
        order: 1,
        title: "Account Creation",
        description: "Set up your Amazon seller account"
      },
      {
        order: 2,
        title: "Verification",
        description: "Complete business verification process"
      }
    ],
    supportedRegions: ["All India"],
    paymentMethods: ["Bank Transfer"],
    shippingOptions: ["FBA", "Easy Ship", "Self Ship"],
    minimumOrderValue: 0,
    status: "active"
  },
  {
    name: "Meesho",
    description: "Social commerce platform ideal for small businesses and resellers",
    logo: "https://logo.clearbit.com/meesho.com",
    website: "https://supplier.meesho.com",
    industries: ["Fashion", "Accessories", "Home & Living"],
    productTypes: ["Fashion", "Accessories", "Home Decor"],
    targetMarket: ["B2C", "Resellers", "Pan India"],
    commissionRate: 10,
    averageRating: 4.0,
    reviewCount: 8000,
    features: [
      {
        title: "Zero Investment",
        description: "Start selling without any registration fee"
      },
      {
        title: "Reseller Network",
        description: "Access to millions of resellers across India"
      }
    ],
    requirements: [
      {
        title: "Basic Documentation",
        description: "GST registration (if applicable) and bank account"
      },
      {
        title: "Product Photos",
        description: "High-quality product images required"
      }
    ],
    onboardingSteps: [
      {
        order: 1,
        title: "Registration",
        description: "Sign up as a Meesho supplier"
      },
      {
        order: 2,
        title: "Catalog Creation",
        description: "Upload your product catalog"
      }
    ],
    supportedRegions: ["All India"],
    paymentMethods: ["Bank Transfer", "UPI"],
    shippingOptions: ["Meesho Logistics"],
    minimumOrderValue: 0,
    status: "active"
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Check if we already have marketplaces
    const existingCount = await MarketPlace.countDocuments();
    
    if (existingCount === 0) {
      // Insert sample marketplaces only if none exist
      await MarketPlace.insertMany(sampleMarketplaces);
    }
    
    return NextResponse.json({ message: "Marketplaces initialized" });
  } catch (error) {
    console.error("Error initializing marketplaces:", error);
    return NextResponse.json(
      { error: "Failed to initialize marketplaces" },
      { status: 500 }
    );
  }
} 