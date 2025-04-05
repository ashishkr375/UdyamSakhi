import { NextResponse } from "next/server";
import { ComplianceItem } from "@/models/ComplianceItem";
import connectDB from "@/lib/mongodb";

const sampleItems = [
  {
    title: "GST Registration",
    description: "Register for Goods and Services Tax if your annual turnover exceeds ₹20 lakhs",
    category: "Taxation",
    priority: "high",
    applicableBusinessTypes: ["All"],
    applicableStates: ["All"],
    dueDate: "2024-03-31",
    link: "https://www.gst.gov.in/",
    status: "active",
    steps: [
      {
        order: 1,
        description: "Gather required documents (PAN, Aadhaar, business registration)",
        estimatedTime: "1-2 days"
      },
      {
        order: 2,
        description: "Fill Form GST REG-01 online",
        estimatedTime: "1 day"
      }
    ],
    fees: {
      amount: 0,
      description: "No fees for registration"
    },
    helpfulLinks: [
      {
        title: "GST Portal",
        url: "https://www.gst.gov.in/"
      }
    ]
  },
  {
    title: "MSME Registration",
    description: "Register your business under MSME to avail government benefits",
    category: "Registration",
    priority: "medium",
    applicableBusinessTypes: ["All"],
    applicableStates: ["All"],
    link: "https://udyamregistration.gov.in/",
    status: "active",
    steps: [
      {
        order: 1,
        description: "Visit Udyam Registration Portal",
        estimatedTime: "30 mins"
      },
      {
        order: 2,
        description: "Fill the online form with Aadhaar",
        estimatedTime: "1 hour"
      }
    ],
    fees: {
      amount: 0,
      description: "Free registration"
    },
    helpfulLinks: [
      {
        title: "Udyam Registration Portal",
        url: "https://udyamregistration.gov.in/"
      }
    ]
  },
  {
    title: "PF Registration",
    description: "Register for Provident Fund if you have 20 or more employees",
    category: "Labor Compliance",
    priority: "high",
    applicableBusinessTypes: ["All"],
    applicableStates: ["All"],
    link: "https://unifiedportal-emp.epfindia.gov.in/",
    status: "active",
    steps: [
      {
        order: 1,
        description: "Apply for PF registration on EPFO portal",
        estimatedTime: "1-2 days"
      }
    ],
    fees: {
      amount: 0,
      description: "No registration fees"
    },
    helpfulLinks: [
      {
        title: "EPFO Portal",
        url: "https://unifiedportal-emp.epfindia.gov.in/"
      }
    ]
  }
];

export async function GET() {
  try {
    await connectDB();
    
    // Check if we already have items
    const existingCount = await ComplianceItem.countDocuments();
    
    if (existingCount === 0) {
      // Insert sample items only if no items exist
      await ComplianceItem.insertMany(sampleItems);
    }
    
    return NextResponse.json({ message: "Compliance items initialized" });
  } catch (error) {
    console.error("Error initializing compliance items:", error);
    return NextResponse.json(
      { error: "Failed to initialize compliance items" },
      { status: 500 }
    );
  }
} 