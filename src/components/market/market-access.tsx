"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarketplaceRecommendations } from "./marketplace-recommendations";
import { MarketAnalysis } from "./market-analysis";
import { GrowthStrategies } from "./growth-strategies";
import type { IBusinessPlan } from "@/models/BusinessPlan";
import type { IMarketPlace } from "@/models/MarketPlace";
import { Store, BarChart3, TrendingUp } from "lucide-react";

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
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg overflow-x-auto h-auto">
        <TabsTrigger 
          value="recommendations"
          className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
        >
          <Store className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">Marketplace</span>
        </TabsTrigger>
        <TabsTrigger 
          value="analysis"
          className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
        >
          <BarChart3 className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">Analysis</span>
        </TabsTrigger>
        <TabsTrigger 
          value="strategies"
          className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
        >
          <TrendingUp className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium">Growth</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="recommendations" className="space-y-4 pt-4">
        <MarketplaceRecommendations businessPlans={businessPlans} />
      </TabsContent>

      <TabsContent value="analysis" className="space-y-4 pt-4">
        <MarketAnalysis businessPlans={businessPlans} />
      </TabsContent>

      <TabsContent value="strategies" className="space-y-4 pt-4">
        <GrowthStrategies businessPlans={businessPlans} />
      </TabsContent>
    </Tabs>
  );
}