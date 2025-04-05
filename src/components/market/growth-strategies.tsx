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
import { Loader2, RefreshCw, CheckCircle2 } from "lucide-react";
import type { IBusinessPlan } from "@/models/BusinessPlan";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {items.map((item, i) => {
            // Handle case where the item might be an object instead of a string
            if (typeof item === 'object' && item !== null) {
              // If it's an object, convert it to a string representation
              try {
                // Check for common patterns in risk mitigation objects
                if ('risk' in item && 'mitigation' in item) {
                  return <li key={i}><strong>{(item as {risk: string}).risk}</strong>: {(item as {mitigation: string}).mitigation}</li>;
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
      <div>
        <h4 className="font-medium mb-1">{title}</h4>
        <div className="text-sm space-y-1 pl-5">
          {Object.entries(costs).map(([key, value]) => {
            if (typeof value === 'string') {
              return <p key={key}><span className="capitalize font-medium">{key}:</span> {value}</p>;
            } else if (key === 'breakdown' && typeof value === 'object' && value !== null) {
              return (
                <div key={key} className="pl-4 mt-1">
                  <p className="font-medium">Breakdown:</p>
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <p key={subKey}><span className="capitalize font-medium">{subKey}:</span> {subValue as string}</p>
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
  const renderRiskMitigation = (items?: (string | RiskMitigationItem)[]) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div>
        <h4 className="font-medium mb-1">Risk Mitigation</h4>
        <ul className="list-disc pl-5 text-sm space-y-1">
          {items.map((item, i) => {
            if (typeof item === 'string') {
              return <li key={i}>{item}</li>;
            } else if (typeof item === 'object' && item !== null) {
              if ('risk' in item && 'mitigation' in item) {
                return (
                  <li key={i}>
                    <strong>{item.risk}</strong>: {item.mitigation}
                  </li>
                );
              }
            }
            // Fallback for unexpected formats
            return <li key={i}>{JSON.stringify(item)}</li>;
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Growth Strategies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Business Plan</label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => {
                setSelectedPlan(value);
                setStrategies(null); // Clear previous strategies on plan change
              }}
              disabled={isGenerating}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a business plan" />
              </SelectTrigger>
              <SelectContent>
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
            className="w-full"
          >
            {(isGenerating || loading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Loading Data..." : (isGenerating ? (hasExistingData ? "Regenerating..." : "Generating...") : (hasExistingData ? "Regenerate Strategies" : "Generate Strategies"))}
          </Button>

        </CardContent>
      </Card>

      {/* Display Results */}
      {strategies && (
        <div className="space-y-6">
          {/* Short Term */}
          {strategies.shortTerm && (
            <Card>
              <CardHeader><CardTitle>Short-Term Strategies (3-6 Months)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {renderList("Marketing Strategies", strategies.shortTerm.marketingStrategies)}
                {renderList("Sales Strategies", strategies.shortTerm.salesStrategies)}
                {renderList("Channel Strategies", strategies.shortTerm.channelStrategies)}
                {renderCosts("Estimated Costs", strategies.shortTerm.estimatedCosts)}
                {renderList("Expected Outcomes", strategies.shortTerm.expectedOutcomes)}
              </CardContent>
            </Card>
          )}

          {/* Long Term */}
          {strategies.longTerm && (
            <Card>
              <CardHeader><CardTitle>Long-Term Strategies (1-2 Years)</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {renderList("Expansion Strategies", strategies.longTerm.expansionStrategies)}
                {renderList("Product Strategies", strategies.longTerm.productStrategies)}
                {renderList("Partnership Strategies", strategies.longTerm.partnershipStrategies)}
                {renderCosts("Investment Required", strategies.longTerm.investmentRequired)}
                {renderList("Expected Outcomes", strategies.longTerm.expectedOutcomes)}
              </CardContent>
            </Card>
          )}

          {/* Key Metrics & Risk Mitigation */}
          {(strategies.keyMetrics || strategies.riskMitigation) && (
             <Card>
              <CardHeader><CardTitle>Metrics & Risks</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {renderList("Key Metrics to Track", strategies.keyMetrics)}
                {renderRiskMitigation(strategies.riskMitigation)}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}