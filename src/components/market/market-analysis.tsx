"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, BarChart3, Users, Landmark, Lightbulb, AlertTriangle, ListTodo } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface MarketAnalysisProps {
  businessPlans: Array<{
    _id: string;
    businessName: string;
  }>;
}

// Interface for the structure of analysis data
interface AnalysisData {
  marketSize: {
    current: string;
    potential: string;
    growthRate: string;
  };
  competitiveLandscape: {
    directCompetitors: string[];
    indirectCompetitors: string[];
    competitiveAdvantages: string[];
  };
  marketOpportunities: string[];
  marketThreats: string[];
  recommendations: string[];
}

export function MarketAnalysis({ businessPlans }: MarketAnalysisProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const fetchExistingData = useCallback(async (planId: string) => {
    if (!planId) return;
    setLoading(true);
    setAnalysis(null);
    setHasExistingData(false);
    try {
      const response = await fetch(`/api/market/data?planId=${planId}&tabType=analysis`);
      if (!response.ok) throw new Error("Failed to fetch existing data");
      const result = await response.json();
      
      // Check if data exists and has expected properties
      if (result.data && (
        result.data.marketSize || 
        result.data.competitiveLandscape || 
        result.data.marketOpportunities || 
        result.data.marketThreats ||
        result.data.recommendations
      )) {
        setAnalysis(result.data);
        setHasExistingData(true);
      } else {
        setHasExistingData(false);
      }
    } catch (err) {
      toast.error("Error fetching existing analysis.");
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
    const toastId = toast.loading(hasExistingData ? "Regenerating analysis..." : "Generating analysis...");

    try {
      const response = await fetch("/api/market/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate analysis");
      }
      
      setAnalysis(result.data);
      setHasExistingData(true); // Data now exists
      toast.success("Analysis generated successfully!", { id: toastId });

    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to generate analysis."}`, { id: toastId });
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Market Analysis</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Analyze your market potential and competitive landscape</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Select Business Plan</label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => {
                setSelectedPlan(value);
                setAnalysis(null); // Clear previous analysis on plan change
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
            {loading ? "Loading Data..." : (isGenerating ? (hasExistingData ? "Regenerating..." : "Generating...") : (hasExistingData ? "Regenerate Analysis" : "Generate Analysis"))}
          </Button>

        </CardContent>
      </Card>

      {/* Display Results */}
      {analysis && (
        <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Market Size */}
            <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                <BarChart3 className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Market Size
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2">
                  <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">Current</Badge>
                  {analysis.marketSize?.current || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Potential</Badge> 
                  {analysis.marketSize?.potential || "N/A"}
                </p>
                <p className="flex items-center gap-2">
                  <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">Growth Rate</Badge>
                  {analysis.marketSize?.growthRate || "N/A"}
                </p>
              </div>
            </div>

            {/* Competitive Landscape */}
            <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Competitive Landscape
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">Direct Competitors</Badge>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {analysis.competitiveLandscape?.directCompetitors?.map((c: string, i: number) => <li key={i}>{c}</li>) ?? <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Indirect Competitors</Badge>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {analysis.competitiveLandscape?.indirectCompetitors?.map((c: string, i: number) => <li key={i}>{c}</li>) ?? <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">Competitive Advantages</Badge>
                  </p>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400">
                    {analysis.competitiveLandscape?.competitiveAdvantages?.map((a: string, i: number) => <li key={i}>{a}</li>) ?? <li>N/A</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Opportunities */}
            <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Market Opportunities
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                {analysis.marketOpportunities?.map((opp: string, i: number) => <li key={i}>{opp}</li>) ?? <li>N/A</li>}
              </ul>
            </div>

            {/* Market Threats */}
            <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                Market Threats
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                {analysis.marketThreats?.map((threat: string, i: number) => <li key={i}>{threat}</li>) ?? <li>N/A</li>}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-3">
                <ListTodo className="h-5 w-5 text-pink-500 dark:text-pink-400" />
                Recommendations
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                {analysis.recommendations?.map((rec: string, i: number) => <li key={i}>{rec}</li>) ?? <li>N/A</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 