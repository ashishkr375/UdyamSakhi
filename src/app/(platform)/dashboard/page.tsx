import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";
import { 
  UserCircle, 
  FileText, 
  PiggyBank, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Info
} from "lucide-react";

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
      <div className="container mx-auto py-8 px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <Card className="p-6 col-span-full border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-pink-200 dark:border-pink-800">
                <AvatarImage src={data.user.avatar?.url} />
                <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                  {data.user.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Welcome back, {data.user.name}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {data.businessProfile?.businessName || "Complete your business profile to get started"}
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Profile Completion</span>
                    <span className="text-pink-600 dark:text-pink-400 font-semibold">{data.stats.profileCompletion}%</span>
                  </div>
                  <Progress 
                    value={data.stats.profileCompletion} 
                    className="h-2 bg-gray-100 dark:bg-gray-700" 
                    indicatorClassName="bg-gradient-to-r from-pink-500 to-purple-500"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6 border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>
            <div className="space-y-2">
              <Button 
                className="w-full justify-between group hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" 
                variant="outline" 
                asChild
              >
                <a href="/my-profile" className="flex items-center">
                  <div className="flex items-center">
                    <UserCircle className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
                    <span>Complete Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" />
                </a>
              </Button>
              <Button 
                className="w-full justify-between group hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" 
                variant="outline" 
                asChild
              >
                <a href="/my-business-plan" className="flex items-center">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-purple-500 dark:text-purple-400" />
                    <span>Create Business Plan</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" />
                </a>
              </Button>
              <Button 
                className="w-full justify-between group hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700" 
                variant="outline" 
                asChild
              >
                <a href="/funding-navigator" className="flex items-center">
                  <div className="flex items-center">
                    <PiggyBank className="h-4 w-4 mr-2 text-pink-500 dark:text-pink-400" />
                    <span>Explore Funding</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" />
                </a>
              </Button>
            </div>
          </Card>

          {/* Business Status Card */}
          <Card className="p-6 border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Business Status</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{data.businessProfile?.industry || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Stage</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{data.businessProfile?.stage || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Business Type</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{data.businessProfile?.type || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Documents</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {data.stats.documentsCount 
                    ? <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> {data.stats.documentsCount} uploaded</span>
                    : <span className="flex items-center"><Circle className="h-4 w-4 mr-1 text-gray-400" /> None uploaded</span>
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Business Plan</p>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  {data.stats.hasBusinesPlan 
                    ? <span className="flex items-center"><CheckCircle2 className="h-4 w-4 mr-1 text-green-500" /> Created</span>
                    : <span className="flex items-center"><Circle className="h-4 w-4 mr-1 text-gray-400" /> Not created</span>
                  }
                </p>
              </div>
            </div>
          </Card>

          {/* Next Steps Card */}
          <Card className="p-6 border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recommended Next Steps</h2>
              <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <ul className="space-y-3">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-md">
                  <span className="w-5 h-5 mt-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{recommendation}</span>
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