"use client";

import * as React from "react";
import { IBusinessPlan } from "@/models/BusinessPlan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface FinancialForecastProps {
  businessPlan: IBusinessPlan;
}

interface FinancialMetrics {
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

export function FinancialForecast({ businessPlan }: FinancialForecastProps) {
  const [metrics, setMetrics] = React.useState<FinancialMetrics | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const generateForecast = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/funding/generate-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: businessPlan._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate forecast");
      }

      const data = await response.json();
      setMetrics(data.forecast);
    } catch (error) {
      toast.error("Failed to generate financial forecast");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Financial Forecast</h2>
        <p className="text-muted-foreground mb-6">
          Generate a detailed financial forecast based on your business plan
        </p>
        <Button onClick={generateForecast} disabled={isLoading}>
          {isLoading ? "Generating..." : "Generate Forecast"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Startup Costs</CardTitle>
            <CardDescription>Initial investment required</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.startupCosts.totalAmount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Break-Even Point</CardTitle>
            <CardDescription>Months to profitability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.keyMetrics.breakEvenPoint.months} months</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROI (Year 1)</CardTitle>
            <CardDescription>Expected return on investment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.keyMetrics.roi}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses (12 Months)</CardTitle>
          <CardDescription>Monthly financial projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.monthlyProjections.revenue.amounts.map((revenue, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Month {index + 1}</span>
                  <span>{formatCurrency(revenue - metrics.monthlyProjections.expenses.amounts[index])}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Revenue</span>
                    <span>{formatCurrency(revenue)}</span>
                  </div>
                  <Progress
                    value={(revenue / Math.max(...metrics.monthlyProjections.revenue.amounts)) * 100}
                    className="h-2 [&>div]:bg-emerald-500 bg-emerald-100"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Expenses</span>
                    <span>{formatCurrency(metrics.monthlyProjections.expenses.amounts[index])}</span>
                  </div>
                  <Progress
                    value={(metrics.monthlyProjections.expenses.amounts[index] / Math.max(...metrics.monthlyProjections.revenue.amounts)) * 100}
                    className="h-2 [&>div]:bg-red-500 bg-red-100"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Important financial indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium">Profit Margin</dt>
              <dd className="text-2xl font-bold">{metrics.keyMetrics.profitMargin}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Monthly Burn Rate</dt>
              <dd className="text-2xl font-bold">
                {formatCurrency(metrics.monthlyProjections.expenses.amounts[0])}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={generateForecast} disabled={isLoading}>
          {isLoading ? "Regenerating..." : "Regenerate Forecast"}
        </Button>
      </div>
    </div>
  );
} 