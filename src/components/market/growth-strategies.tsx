"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, RefreshCw, CheckCircle2, TrendingUp, Clock, BarChart3, AlertCircle, ArrowUpRight, PiggyBank } from "lucide-react";
import type { IBusinessPlan } from "@/models/BusinessPlan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface GrowthStrategiesProps {
  businessPlans: Array<{
    _id: string;
    businessName: string;
  }>;
}

// Interfaces for the structure of strategies data
interface CostEstimate {
  marketing?: string;
  sales?: string;
  channels?: string;
  expansion?: string;
  product?: string;
  partnerships?: string;
  total?: string;
  breakdown?: CostEstimate; // For nested structure
}

interface StrategySet {
  marketingStrategies?: string[];
  salesStrategies?: string[];
  channelStrategies?: string[];
  estimatedCosts?: CostEstimate;
  expectedOutcomes?: string[];
  expansionStrategies?: string[];
  productStrategies?: string[];
  partnershipStrategies?: string[];
  investmentRequired?: CostEstimate;
}

interface RiskMitigationItem {
  risk: string;
  mitigation: string;
}

interface StrategiesData {
  shortTerm?: StrategySet;
  longTerm?: StrategySet;
  keyMetrics?: string[];
  riskMitigation?: (string | RiskMitigationItem)[];
}

export function GrowthStrategies({ businessPlans }: GrowthStrategiesProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [strategies, setStrategies] = useState<StrategiesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const fetchExistingData = useCallback(async (planId: string) => {
    if (!planId) return;
    setLoading(true);
    setStrategies(null);
    setHasExistingData(false);
    try {
      const response = await fetch(`/api/market/data?planId=${planId}&tabType=strategies`);
      if (!response.ok) throw new Error("Failed to fetch existing data");
      const result = await response.json();
      
      // Check if data exists and has expected properties
      if (result.data && (
        result.data.shortTerm || 
        result.data.longTerm || 
        result.data.keyMetrics || 
        result.data.riskMitigation
      )) {
        setStrategies(result.data);
        setHasExistingData(true);
      } else {
        setHasExistingData(false);
      }
    } catch (err) {
      toast.error("Error fetching existing strategies.");
      console.error(err);
      setHasExistingData(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchExistingData(selectedPlan);
    }
  }, [selectedPlan, fetchExistingData]);

  const handleGenerate = async () => {
    if (!selectedPlan) {
      toast.error("Please select a business plan first.");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading(hasExistingData ? "Regenerating strategies..." : "Generating strategies...");

    try {
      const response = await fetch("/api/market/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate strategies");
      }
      
      setStrategies(result.data);
      setHasExistingData(true); // Data now exists
      toast.success("Strategies generated successfully!", { id: toastId });

    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to generate strategies."}`, { id: toastId });
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderList = (title: string, items?: any[]) => (
    items && items.length > 0 ? (
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{title}</h4>
        <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600 dark:text-gray-400">
          {items.map((item, i) => {
            // Handle case where the item might be an object instead of a string
            if (typeof item === 'object' && item !== null) {
              // If it's an object, convert it to a string representation
              try {
                // Check for common patterns in risk mitigation objects
                if ('risk' in item && 'mitigation' in item) {
                  return <li key={i}><strong className="text-gray-900 dark:text-gray-100">{(item as {risk: string}).risk}</strong>: {(item as {mitigation: string}).mitigation}</li>;
                }
                // For other objects, stringify them
                return <li key={i}>{JSON.stringify(item)}</li>;
              } catch (err) {
                console.error("Error rendering list item:", err);
                return <li key={i}>Error displaying item</li>;
              }
            }
            // Regular string item
            return <li key={i}>{item}</li>;
          })}
        </ul>
      </div>
    ) : null
  );

  const renderCosts = (title: string, costs?: CostEstimate) => (
    costs ? (
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{title}</h4>
        <div className="text-sm space-y-1 pl-5 text-gray-600 dark:text-gray-400">
          {Object.entries(costs).map(([key, value]) => {
            if (typeof value === 'string') {
              return <p key={key} className="flex justify-between"><span className="capitalize font-medium">{key}:</span> <span>{value}</span></p>;
            } else if (key === 'breakdown' && typeof value === 'object' && value !== null) {
              return (
                <div key={key} className="pl-4 mt-3 space-y-1 border-l-2 border-purple-100 dark:border-purple-900">
                  <p className="font-medium text-gray-800 dark:text-gray-200">Breakdown:</p>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <p key={subKey} className="flex justify-between"><span className="capitalize font-medium">{subKey}:</span> <span>{subValue as string}</span></p>
                  ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    ) : null
  );

  // Special renderer for risk mitigation items which can be strings or objects
  const renderRiskMitigation = (items?: (string | RiskMitigationItem)[]) => (
    items && items.length > 0 ? (
      <div className="space-y-1">
        {items.map((item, i) => {
          if (typeof item === 'object' && item !== null && 'risk' in item && 'mitigation' in item) {
            const typedItem = item as RiskMitigationItem;
            return (
              <div key={i} className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg mb-2">
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {typedItem.risk}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 pl-5">
                  <span className="font-medium text-purple-600 dark:text-purple-400">Mitigation:</span> {typedItem.mitigation}
                </p>
              </div>
            );
          }
          return <p key={i} className="text-sm text-gray-600 dark:text-gray-400">{item as string}</p>;
        })}
      </div>
    ) : null
  );

  return (
    <div className="space-y-4">
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Growth Strategies</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Generate short and long-term strategies to grow your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Select Business Plan</label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => {
                setSelectedPlan(value);
                setStrategies(null); // Clear previous strategies on plan change
              }}
              disabled={isGenerating}
            >
              <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                <SelectValue placeholder="Choose a business plan" />
              </SelectTrigger>
              <SelectContent className="border-purple-100 dark:border-purple-900">
                {businessPlans.map((plan) => (
                  <SelectItem key={plan._id} value={plan._id}>
                    {plan.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || loading || !selectedPlan}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
          >
            {(isGenerating || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading Data..." : (isGenerating ? (hasExistingData ? "Regenerating..." : "Generating...") : (hasExistingData ? "Regenerate Strategies" : "Generate Strategies"))}
          </Button>

        </CardContent>
      </Card>

      {/* Display Results */}
      {strategies && (
        <div className="space-y-4">
          {/* Short Term Strategies */}
          {strategies.shortTerm && (
            <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                    Short-Term Growth Strategies
                  </CardTitle>
                  <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">6-12 Months</Badge>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">Implement these strategies over the next 6-12 months</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {renderList("Marketing Strategies", strategies.shortTerm.marketingStrategies)}
                  {renderList("Sales Strategies", strategies.shortTerm.salesStrategies)}
                  {renderList("Channel Strategies", strategies.shortTerm.channelStrategies)}
                  
                  {renderCosts("Estimated Costs", strategies.shortTerm.estimatedCosts)}
                  
                  <Separator className="my-4 bg-gray-100 dark:bg-gray-700" />
                  
                  {renderList("Expected Outcomes", strategies.shortTerm.expectedOutcomes)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Long Term Strategies */}
          {strategies.longTerm && (
            <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    Long-Term Growth Strategies
                  </CardTitle>
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">1-3 Years</Badge>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400">Implement these strategies over the next 1-3 years</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {renderList("Expansion Strategies", strategies.longTerm.expansionStrategies)}
                  {renderList("Product Strategies", strategies.longTerm.productStrategies)}
                  {renderList("Partnership Strategies", strategies.longTerm.partnershipStrategies)}
                  
                  {renderCosts("Investment Required", strategies.longTerm.investmentRequired)}
                  
                  <Separator className="my-4 bg-gray-100 dark:bg-gray-700" />
                  
                  {renderList("Expected Outcomes", strategies.longTerm.expectedOutcomes)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          {strategies.keyMetrics && strategies.keyMetrics.length > 0 && (
            <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                  Key Metrics to Track
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Monitor these metrics to measure success</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strategies.keyMetrics.map((metric, i) => (
                    <div key={i} className="p-3 border border-gray-100 dark:border-gray-700 rounded-lg flex items-center gap-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20">
                        <ArrowUpRight className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      </div>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Risk Mitigation */}
          {strategies.riskMitigation && strategies.riskMitigation.length > 0 && (
            <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                  Risk Mitigation
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Plan for potential risks and challenges</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {renderRiskMitigation(strategies.riskMitigation)}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}