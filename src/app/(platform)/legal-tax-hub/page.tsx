import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ComplianceItem } from "@/models/ComplianceItem";
import connectDB from "@/lib/mongodb";
import { LegalTaxHub } from "@/components/legal/legal-tax-hub";
import { User } from "@/models/User";

async function getComplianceItems(businessType: string, state: string) {
  await connectDB();
  // First ensure we have the initial sample items
  await fetch(`${process.env.NEXTAUTH_URL}/api/legal/compliance-items`, {
    method: 'GET',
    cache: 'no-store'
  });
  
  // Then fetch the applicable items for this business
  return ComplianceItem.find({
    status: "active",
    $and: [
      {
        $or: [
          { applicableBusinessTypes: businessType },
          { applicableBusinessTypes: "All" }
        ]
      },
      {
        $or: [
          { applicableStates: state },
          { applicableStates: "All" }
        ]
      }
    ]
  }).sort({ priority: -1 });
}

async function getUserBusinessInfo(userId: string) {
  await connectDB();
  const user = await User.findById(userId);
  if (!user?.businessProfile) {
    return {
      businessType: "Other",
      state: "All"
    };
  }
  return {
    businessType: user.businessProfile.type || "Other",
    state: user.businessProfile.state || "All",
  };
}

// Make page dynamically generated to ensure we always get the latest data
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Turn off caching to always fetch latest data

export default async function LegalTaxHubPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { businessType, state } = await getUserBusinessInfo(session.user.id);
  const complianceItems = await getComplianceItems(businessType, state);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Legal & Tax Hub</h1>
      <LegalTaxHub
        complianceItems={JSON.parse(JSON.stringify(complianceItems))}
        businessType={businessType}
        state={state}
      />
    </div>
  );
} 