"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceRecommendations } from "./marketplace-recommendations";
import { MarketAnalysis } from "./market-analysis";
import { GrowthStrategies } from "./growth-strategies";
import type { IBusinessPlan } from "@/models/BusinessPlan";
import type { IMarketPlace } from "@/models/MarketPlace";

interface BusinessPlan {
  _id: string;
  businessName: string;
  industry: string;
  targetMarket: string;
  productsServices: string;
  competition: string;
  marketSize: string;
}

interface Marketplace {
  name: string;
  description: string;
  logo: string;
  website: string;
  industries: string[];
  features: Array<{
    title: string;
    description: string;
  }>;
  requirements: Array<{
    title: string;
    description: string;
  }>;
  commissionRate: number;
  averageRating: number;
}

interface MarketAccessProps {
  businessPlans: BusinessPlan[];
}

export function MarketAccess({ businessPlans = [] }: MarketAccessProps) {
  const [activeTab, setActiveTab] = useState("recommendations");

  return (
    <Tabs
      defaultValue="recommendations"
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-4"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recommendations">
          Marketplace Recommendations
        </TabsTrigger>
        <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
        <TabsTrigger value="strategies">Growth Strategies</TabsTrigger>
      </TabsList>

      <TabsContent value="recommendations" className="space-y-4">
        <MarketplaceRecommendations businessPlans={businessPlans} />
      </TabsContent>

      <TabsContent value="analysis" className="space-y-4">
        <MarketAnalysis businessPlans={businessPlans} />
      </TabsContent>

      <TabsContent value="strategies" className="space-y-4">
        <GrowthStrategies businessPlans={businessPlans} />
      </TabsContent>
    </Tabs>
  );
}