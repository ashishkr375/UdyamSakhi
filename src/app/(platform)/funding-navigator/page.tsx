import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BusinessPlan } from "@/models/BusinessPlan";
import { FundingScheme } from "@/models/FundingScheme";
import connectDB from "@/lib/mongodb";
import { FundingNavigator } from "@/components/funding/funding-navigator";
import { PiggyBank } from "lucide-react";

async function getBusinessPlans(userId: string) {
  await connectDB();
  return BusinessPlan.find({ userId }).sort({ createdAt: -1 });
}

async function getFundingSchemes() {
  await connectDB();
  return FundingScheme.find({ status: "active" });
}

export default async function FundingNavigatorPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const [businessPlans, fundingSchemes] = await Promise.all([
    getBusinessPlans(session.user.id),
    getFundingSchemes(),
  ]);

  if (!businessPlans?.length) {
    redirect("/my-business-plan");
  }

  return (
    <div className="container mx-auto py-8 px-2 md:px-4">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <PiggyBank className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          Funding Navigator
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Explore funding options suitable for your business
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900 p-3 sm:p-6">
        <FundingNavigator
          businessPlans={JSON.parse(JSON.stringify(businessPlans))}
          fundingSchemes={JSON.parse(JSON.stringify(fundingSchemes))}
        />
      </div>
    </div>
  );
} 