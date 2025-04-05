import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BusinessPlan } from "@/models/BusinessPlan";
import connectDB from "@/lib/mongodb";
import { BusinessPlanForm } from "@/components/business-plan/business-plan-form";
import { BusinessPlanView } from "@/components/business-plan/business-plan-view";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

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
    <div className="container mx-auto py-8 px-2 md:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            My Business Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {existingPlan ? "View and manage your business plan" : "Create a structured plan for your business"}
          </p>
        </div>
        {/* {existingPlan && (
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white" asChild>
            <a href="/my-business-plan/new" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Create New Plan
            </a>
          </Button>
        )} */}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900 p-3 sm:p-6">
        {existingPlan ? (
          <BusinessPlanView plan={JSON.parse(JSON.stringify(existingPlan))} />
        ) : (
          <BusinessPlanForm />
        )}
      </div>
    </div>
  );
} 