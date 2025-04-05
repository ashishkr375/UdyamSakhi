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
import { 
  PiggyBank, 
  FileText, 
  ArrowRight, 
  BarChart, 
  CalendarClock, 
  TrendingUp, 
  Briefcase,
  Percent,
  RefreshCcw,
  LineChart
} from "lucide-react";

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
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generating Financial Forecast</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing your business plan and market data. This may take 2-3 minutes.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 dark:border-pink-400 mx-auto"></div>
          </div>
        </div>
      )}

      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            Select Business Plan
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Choose a business plan to generate funding forecast</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
            <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
              <SelectValue placeholder="Select a business plan" />
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800">
              {businessPlans.map((plan) => (
                <SelectItem key={plan._id} value={plan._id} className="text-gray-700 dark:text-gray-300">
                  {plan.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={generateForecast} 
            disabled={!selectedPlanId || isGenerating}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white flex items-center justify-center gap-2"
          >
            <BarChart className="h-4 w-4" />
            Generate Forecast
          </Button>
        </CardContent>
      </Card>

      {forecast && (
        <>
          <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Startup Costs
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Initial investment required</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center font-semibold bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">Total Required:</span>
                  <span className="text-pink-600 dark:text-pink-400">{formatCurrency(forecast.startupCosts.totalAmount)}</span>
                </div>
                <div className="grid gap-2">
                  {Object.entries(forecast.startupCosts.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 py-2">
                      <span className="capitalize text-gray-700 dark:text-gray-300">{key}:</span>
                      <span className="text-gray-800 dark:text-gray-200">{formatCurrency(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Key Metrics
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Financial performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CalendarClock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      Break-even Point:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {forecast.keyMetrics.breakEvenPoint.months} months 
                      <span className="text-pink-600 dark:text-pink-400 ml-1">
                        ({formatCurrency(forecast.keyMetrics.breakEvenPoint.amount)})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Percent className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      Profit Margin:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      <span className="text-pink-600 dark:text-pink-400">
                        {(forecast.keyMetrics.profitMargin * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <RefreshCcw className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      ROI:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      <span className="text-pink-600 dark:text-pink-400">
                        {(forecast.keyMetrics.roi * 100).toFixed(1)}%
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <CalendarClock className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      Payback Period:
                    </span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {forecast.keyMetrics.paybackPeriod} months
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Recommended Funding Sources
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Suggested funding mix based on your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {forecast.fundingNeeds.recommendedSources.map((source, index) => (
                  <div key={index} className="border border-purple-100 dark:border-purple-900 rounded-lg p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center font-semibold mb-2">
                      <span className="text-gray-800 dark:text-gray-200">{source.source}</span>
                      <span className="text-pink-600 dark:text-pink-400">{formatCurrency(source.amount)}</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" /> Type: {source.type}
                      </p>
                      <p className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" /> Terms: {source.terms}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <LineChart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                Monthly Projections
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Revenue and expense forecasts for the next 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Monthly Revenue
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                    {forecast.monthlyProjections.revenue.amounts.map((amount, index) => (
                      <div key={index} className="border border-green-100 dark:border-green-900/30 rounded-lg p-3 text-center bg-green-50/50 dark:bg-green-900/10">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Month {index + 1}</div>
                        <div className="font-medium text-green-600 dark:text-green-400">{formatCurrency(amount)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
                    Monthly Expenses
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                    {forecast.monthlyProjections.expenses.amounts.map((amount, index) => (
                      <div key={index} className="border border-red-100 dark:border-red-900/30 rounded-lg p-3 text-center bg-red-50/50 dark:bg-red-900/10">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Month {index + 1}</div>
                        <div className="font-medium text-red-600 dark:text-red-400">{formatCurrency(amount)}</div>
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