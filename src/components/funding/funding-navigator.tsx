"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface BusinessPlan {
  _id: string;
  businessName: string;
  industry: string;
  targetMarket: string;
  createdAt: string;
}

interface FundingScheme {
  _id: string;
  name: string;
  provider: string;
  type: string;
  maxAmount: number;
  eligibility: string[];
  documents: string[];
}

interface FundingNavigatorProps {
  businessPlans: BusinessPlan[];
  fundingSchemes: FundingScheme[];
}

interface Forecast {
  startupCosts: {
    totalAmount: number;
    breakdown: {
      equipment: number;
      licenses: number;
      initialInventory: number;
      marketing: number;
      workingCapital: number;
      others: number;
    };
  };
  monthlyProjections: {
    revenue: {
      amounts: number[];
      sources: {
        productSales: number;
        services: number;
        other: number;
      };
    };
    expenses: {
      amounts: number[];
      breakdown: {
        rawMaterials: number;
        labor: number;
        utilities: number;
        rent: number;
        marketing: number;
        others: number;
      };
    };
  };
  keyMetrics: {
    breakEvenPoint: {
      months: number;
      amount: number;
    };
    profitMargin: number;
    roi: number;
    paybackPeriod: number;
  };
  fundingNeeds: {
    totalRequired: number;
    recommendedSources: Array<{
      source: string;
      amount: number;
      type: string;
      terms: string;
    }>;
  };
}

export function FundingNavigator({ businessPlans, fundingSchemes }: FundingNavigatorProps) {
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [forecast, setForecast] = React.useState<Forecast | null>(null);

  const selectedPlan = businessPlans.find(plan => plan._id === selectedPlanId);

  const generateForecast = async () => {
    if (!selectedPlanId) {
      toast.error("Please select a business plan first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/funding/generate-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlanId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate forecast");
      }

      const data = await response.json();
      setForecast(data.forecast);
      toast.success("Forecast generated successfully!");
    } catch (error) {
      console.error("Forecast generation error:", error);
      toast.error("Failed to generate forecast. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold">Generating Financial Forecast</h3>
            <p className="text-muted-foreground">
              Analyzing your business plan and market data. This may take 2-3 minutes.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Select Business Plan</CardTitle>
          <CardDescription>Choose a business plan to generate funding forecast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a business plan" />
            </SelectTrigger>
            <SelectContent>
              {businessPlans.map((plan) => (
                <SelectItem key={plan._id} value={plan._id}>
                  {plan.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={generateForecast} 
            disabled={!selectedPlanId || isGenerating}
            className="w-full"
          >
            Generate Forecast
          </Button>
        </CardContent>
      </Card>

      {forecast && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Startup Costs</CardTitle>
              <CardDescription>Initial investment required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Required:</span>
                  <span>{formatCurrency(forecast.startupCosts.totalAmount)}</span>
                </div>
                <div className="grid gap-2">
                  {Object.entries(forecast.startupCosts.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize">{key}:</span>
                      <span>{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Financial performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between items-center">
                    <span>Break-even Point:</span>
                    <span>{forecast.keyMetrics.breakEvenPoint.months} months ({formatCurrency(forecast.keyMetrics.breakEvenPoint.amount)})</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Profit Margin:</span>
                    <span>{(forecast.keyMetrics.profitMargin * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ROI:</span>
                    <span>{(forecast.keyMetrics.roi * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payback Period:</span>
                    <span>{forecast.keyMetrics.paybackPeriod} months</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Funding Sources</CardTitle>
              <CardDescription>Suggested funding mix based on your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.fundingNeeds.recommendedSources.map((source, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center font-semibold mb-2">
                      <span>{source.source}</span>
                      <span>{formatCurrency(source.amount)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Type: {source.type}</p>
                      <p>Terms: {source.terms}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Projections</CardTitle>
              <CardDescription>Revenue and expense forecasts for the next 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Monthly Revenue</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {forecast.monthlyProjections.revenue.amounts.map((amount, index) => (
                      <div key={index} className="border rounded p-2 text-center">
                        <div className="text-sm text-muted-foreground">Month {index + 1}</div>
                        <div className="font-medium">{formatCurrency(amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Monthly Expenses</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {forecast.monthlyProjections.expenses.amounts.map((amount, index) => (
                      <div key={index} className="border rounded p-2 text-center">
                        <div className="text-sm text-muted-foreground">Month {index + 1}</div>
                        <div className="font-medium">{formatCurrency(amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 