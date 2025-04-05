import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BusinessPlan } from "@/models/BusinessPlan";
import { FundingScheme } from "@/models/FundingScheme";
import connectDB from "@/lib/mongodb";
import { FundingNavigator } from "@/components/funding/funding-navigator";

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Funding Navigator</h1>
      <FundingNavigator
        businessPlans={JSON.parse(JSON.stringify(businessPlans))}
        fundingSchemes={JSON.parse(JSON.stringify(fundingSchemes))}
      />
    </div>
  );
} 