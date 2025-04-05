import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BusinessPlan } from "@/models/BusinessPlan";
import connectDB from "@/lib/mongodb";
import { BusinessPlanForm } from "@/components/business-plan/business-plan-form";
import { BusinessPlanView } from "@/components/business-plan/business-plan-view";
import { Button } from "@/components/ui/button";

async function getBusinessPlan(userId: string) {
  await connectDB();
  return BusinessPlan.findOne({ userId }).sort({ createdAt: -1 });
}

export default async function BusinessPlanPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const existingPlan = await getBusinessPlan(session.user.id);

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Business Plan</h1>
        {existingPlan && (
          <Button asChild>
            <a href="/my-business-plan/new">Create New Plan</a>
          </Button>
        )}
      </div>
      {existingPlan ? (
        <BusinessPlanView plan={JSON.parse(JSON.stringify(existingPlan))} />
      ) : (
        <BusinessPlanForm />
      )}
    </div>
  );
} 