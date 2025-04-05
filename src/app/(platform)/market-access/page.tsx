import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { MarketAccess } from "@/components/market/market-access";
import { BusinessPlan } from "@/models/BusinessPlan";
import { MarketPlace } from "@/models/MarketPlace";
import { FundingScheme } from "@/models/FundingScheme";


async function getBusinessPlans(userId: string) {
  await connectDB();
  try {
    const plans = await BusinessPlan.find({ userId }).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(plans));
  } catch (error) {
    console.error("Error fetching business plans:", error);
    return [];
  }
}

async function initializeMarketplaces() {
  try {
    // This is a server component, so we can call the API directly
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/market/init`, {
      method: 'GET',
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error initializing marketplaces:", errorData);
      throw new Error(`Failed to initialize marketplaces: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error initializing marketplaces:", error);
    // Don't throw here to allow the page to load even if marketplace initialization fails
    return { error: true };
  }
}

// Check for required environment variables
function checkEnvironmentVariables() {
  const missingVars = [];
  
  if (!process.env.AI_API_KEY) {
    missingVars.push('AI_API_KEY');
  }
  
  if (!process.env.NEXTAUTH_URL) {
    missingVars.push('NEXTAUTH_URL');
  }
  
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
}

export default async function MarketAccessPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth");
  }

  // Check environment variables
  const envVarsConfigured = checkEnvironmentVariables();
  if (!envVarsConfigured) {
    console.error("Market Access module requires AI_API_KEY to be configured");
  }

  // Initialize marketplaces to ensure data exists
  await initializeMarketplaces();

  const businessPlans = await getBusinessPlans(session.user.id);

  if (!businessPlans?.length) {
    redirect("/my-business-plan");
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Market Access Hub</h2>
      </div>
      <MarketAccess 
        businessPlans={businessPlans}
      />
    </div>
  );
} 