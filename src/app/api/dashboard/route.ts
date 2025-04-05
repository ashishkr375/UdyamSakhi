import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

interface BusinessProfile {
  businessName?: string;
  industry?: string;
  stage?: string;
  location?: string;
}

interface UserDocument {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
  };
  businessProfile?: BusinessProfile;
  documents?: Array<any>;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please log in to access this resource" },
        { status: 401 }
      );
    }

    await connectDB();

    // Fetch user data including business profile
    const userDoc = await User.findOne({ email: session.user.email })
      .select('name email avatar businessProfile documents')
      .lean();
    
    if (!userDoc) {
      return NextResponse.json(
        { error: "Not Found", message: "User profile not found" },
        { status: 404 }
      );
    }

    // Type assertion after null check
    const user = userDoc as unknown as UserDocument;

    // Calculate profile completion percentage
    const profileFields = [
      user.name,
      user.email,
      user.avatar,
      user.businessProfile?.businessName,
      user.businessProfile?.industry,
      user.businessProfile?.stage,
      user.businessProfile?.location,
    ];
    const completedFields = profileFields.filter(field => field !== undefined && field !== null).length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

    // Get documents count
    const documentsCount = user.documents?.length || 0;

    // Generate recommendations based on profile completion
    const recommendations = [];
    if (!user.businessProfile?.businessName) {
      recommendations.push('Complete your business profile');
    }
    if (documentsCount === 0) {
      recommendations.push('Upload essential business documents');
    }
    if (!user.businessProfile?.industry) {
      recommendations.push('Specify your industry');
    }
    recommendations.push('Create your business plan');
    recommendations.push('Explore funding options');

    const response = {
      user: {
        name: user.name || session.user.name,
        email: user.email || session.user.email,
        avatar: user.avatar || null,
      },
      businessProfile: user.businessProfile || {},
      stats: {
        profileCompletion,
        documentsCount,
      },
      recommendations: recommendations.slice(0, 3), // Show top 3 recommendations
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: "Failed to fetch dashboard data. Please try again later."
      },
      { status: 500 }
    );
  }
} 