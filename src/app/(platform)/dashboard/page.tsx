import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

interface DashboardData {
  user: {
    name: string;
    email: string;
    avatar?: {
      url: string;
    };
  };
  businessProfile: {
    businessName?: string;
    industry?: string;
    stage?: string;
    type?: string;
    state?: string;
  };
  stats: {
    profileCompletion: number;
    documentsCount: number;
    hasBusinesPlan: boolean;
  };
  recommendations: string[];
}

async function getDashboardData(userEmail: string): Promise<DashboardData> {
  await connectDB();

  const user = await User.findOne({ email: userEmail })
    .select('name email avatar businessProfile documents')
    .lean();

  if (!user) {
    throw new Error('User not found');
  }

  // Check if user has business plan
  const hasBusinesPlan = Boolean(user.businessProfile?.businessName && 
                                user.businessProfile?.industry && 
                                user.businessProfile?.stage);

  // Calculate profile completion percentage with more factors
  const profileFields = [
    user.name,                              // Basic info
    user.email,                             // Basic info
    user.avatar?.url,                       // Has profile picture
    user.businessProfile?.businessName,     // Business name
    user.businessProfile?.industry,         // Industry
    user.businessProfile?.stage,            // Business stage
    user.businessProfile?.type,             // Business type
    user.businessProfile?.state,            // State
    user.businessProfile?.udyamNumber,      // Udyam registration
    user.documents && user.documents.length > 0, // Has uploaded documents
    hasBusinesPlan,                         // Has created business plan
  ];
  
  // Count completed fields
  const completedFields = profileFields.filter(field => field).length;
  const totalFields = profileFields.length;
  const profileCompletion = Math.round((completedFields / totalFields) * 100);

  // Get documents count
  const documentsCount = user.documents?.length || 0;

  // Generate recommendations based on what's missing
  const recommendations = [];
  if (!user.businessProfile?.businessName || !user.businessProfile?.industry || !user.businessProfile?.stage) {
    recommendations.push('Complete your business profile');
  }
  if (documentsCount === 0) {
    recommendations.push('Upload essential business documents');
  }
  if (!hasBusinesPlan) {
    recommendations.push('Create your business plan');
  }
  if (!user.businessProfile?.type) {
    recommendations.push('Specify your business type');
  }
  if (!user.businessProfile?.state) {
    recommendations.push('Specify your business state');
  }
  if (!user.businessProfile?.udyamNumber) {
    recommendations.push('Add your Udyam registration number');
  }
  recommendations.push('Explore funding options');
  recommendations.push('Browse mentor connections');

  return {
    user: {
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    businessProfile: user.businessProfile || {},
    stats: {
      profileCompletion,
      documentsCount,
      hasBusinesPlan
    },
    recommendations: recommendations.slice(0, 3), // Show top 3 recommendations
  };
}

export default async function DashboardPage() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      redirect("/login");
    }

    const data = await getDashboardData(session.user.email);

    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <Card className="p-6 col-span-full">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={data.user.avatar?.url} />
                <AvatarFallback>{data.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold">Welcome back, {data.user.name}!</h1>
                <p className="text-muted-foreground">
                  {data.businessProfile?.businessName || "Complete your business profile"}
                </p>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Profile Completion</span>
                    <span>{data.stats.profileCompletion}%</span>
                  </div>
                  <Progress value={data.stats.profileCompletion} className="h-2" />
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/my-profile">Complete Profile</a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/my-business-plan">Create Business Plan</a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/funding-navigator">Explore Funding</a>
              </Button>
            </div>
          </Card>

          {/* Business Status Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Business Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{data.businessProfile?.industry || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stage</p>
                <p className="font-medium">{data.businessProfile?.stage || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Type</p>
                <p className="font-medium">{data.businessProfile?.type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="font-medium">{data.stats.documentsCount} uploaded</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Plan</p>
                <p className="font-medium">{data.stats.hasBusinesPlan ? "Created" : "Not created"}</p>
              </div>
            </div>
          </Card>

          {/* Next Steps Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Next Steps</h2>
            <ul className="space-y-2">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  • {recommendation}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard page error:', error);
    throw error; // Let Next.js error boundary handle it
  }
} 