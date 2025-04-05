"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
      <Card>
        <CardHeader>
          <CardTitle>Market Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Business Plan</label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => {
                setSelectedPlan(value);
                setAnalysis(null); // Clear previous analysis on plan change
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
            {loading ? "Loading Data..." : (isGenerating ? (hasExistingData ? "Regenerating..." : "Generating...") : (hasExistingData ? "Regenerate Analysis" : "Generate Analysis"))}
          </Button>

        </CardContent>
      </Card>

      {/* Display Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Market Size */}
            <div>
              <h3 className="font-semibold mb-2">Market Size</h3>
              <div className="space-y-2 text-sm">
                <p>Current: {analysis.marketSize?.current || "N/A"}</p>
                <p>Potential: {analysis.marketSize?.potential || "N/A"}</p>
                <p>Growth Rate: {analysis.marketSize?.growthRate || "N/A"}</p>
              </div>
            </div>

            {/* Competitive Landscape */}
            <div>
              <h3 className="font-semibold mb-2">Competitive Landscape</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium">Direct Competitors:</p>
                  <ul className="list-disc pl-5">
                    {analysis.competitiveLandscape?.directCompetitors?.map((c: string, i: number) => <li key={i}>{c}</li>) ?? <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Indirect Competitors:</p>
                  <ul className="list-disc pl-5">
                    {analysis.competitiveLandscape?.indirectCompetitors?.map((c: string, i: number) => <li key={i}>{c}</li>) ?? <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Competitive Advantages:</p>
                  <ul className="list-disc pl-5">
                    {analysis.competitiveLandscape?.competitiveAdvantages?.map((a: string, i: number) => <li key={i}>{a}</li>) ?? <li>N/A</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Market Opportunities */}
            <div>
              <h3 className="font-semibold mb-2">Market Opportunities</h3>
              <ul className="list-disc pl-5 text-sm">
                {analysis.marketOpportunities?.map((o: string, i: number) => <li key={i}>{o}</li>) ?? <li>N/A</li>}
              </ul>
            </div>

            {/* Market Threats */}
            <div>
              <h3 className="font-semibold mb-2">Market Threats</h3>
              <ul className="list-disc pl-5 text-sm">
                {analysis.marketThreats?.map((t: string, i: number) => <li key={i}>{t}</li>) ?? <li>N/A</li>}
              </ul>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 text-sm">
                {analysis.recommendations?.map((r: string, i: number) => <li key={i}>{r}</li>) ?? <li>N/A</li>}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 