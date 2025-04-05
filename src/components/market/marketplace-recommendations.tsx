"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface MarketplaceRecommendationsProps {
  businessPlans?: Array<{
    _id: string;
    businessName: string;
  }>;
}

interface MarketFeature {
  title: string;
  description: string;
}

interface Recommendation {
  _id: string;
  name: string;
  logo: string;
  website: string;
  features: MarketFeature[];
  averageRating?: number; // Make optional as per API response
  commissionRate: number;
  matchScore: number;
  reasons: string[];
}

// Interface for the data structure stored in DB / fetched
interface RecommendationsData {
  recommendations: Recommendation[];
}

export function MarketplaceRecommendations({
  businessPlans = [],
}: MarketplaceRecommendationsProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [recommendationsData, setRecommendationsData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  const fetchExistingData = useCallback(async (planId: string) => {
    if (!planId) return;
    setLoading(true);
    setRecommendationsData(null);
    setHasExistingData(false);
    try {
      const response = await fetch(`/api/market/data?planId=${planId}&tabType=recommendations`);
      if (!response.ok) throw new Error("Failed to fetch existing data");
      const result = await response.json();
      
      // Check if we have data and recommendations property (even if empty array)
      if (result.data && 'recommendations' in result.data) {
        setRecommendationsData(result.data);
        // Only consider it as existing data if there are actual recommendations
        setHasExistingData(result.data.recommendations.length > 0);
      } else {
        setHasExistingData(false);
      }
    } catch (err) {
      toast.error("Error fetching existing recommendations.");
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
    const toastId = toast.loading(hasExistingData ? "Regenerating recommendations..." : "Generating recommendations...");

    try {
      const response = await fetch("/api/market/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate recommendations");
      }
      
      setRecommendationsData(result.data);
      setHasExistingData(true); // Data now exists
      toast.success("Recommendations generated successfully!", { id: toastId });

    } catch (err: any) {
      toast.error(`Error: ${err.message || "Failed to generate recommendations."}`, { id: toastId });
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!businessPlans?.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No business plans found. Please create a business plan first.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Marketplace Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Business Plan</label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => {
                setSelectedPlan(value);
                setRecommendationsData(null);
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
            {loading ? "Loading Data..." : (isGenerating ? (hasExistingData ? "Regenerating..." : "Generating...") : (hasExistingData ? "Regenerate Recommendations" : "Get Recommendations"))}
          </Button>

        </CardContent>
      </Card>

      {/* Display Results */}
      {recommendationsData?.recommendations && recommendationsData.recommendations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendationsData.recommendations.map((marketplace, index) => (
            <Card key={marketplace._id || index}>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <img
                    src={marketplace.logo || '/placeholder.svg'} // Fallback logo
                    alt={marketplace.name}
                    className="h-8 w-8 rounded-full object-contain bg-muted"
                    onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Handle image load errors
                  />
                  <div>
                    <CardTitle className="text-lg">{marketplace.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Rating: {marketplace.averageRating?.toFixed(1) || 'N/A'}/5</span>
                      <span>•</span>
                      <span>{marketplace.commissionRate}% commission</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Match Score: {marketplace.matchScore}%</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {marketplace.reasons?.map((reason: string, i: number) => (
                      <li key={i}>{reason}</li>
                    )) ?? <li>N/A</li>}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Key Features</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {marketplace.features?.slice(0, 3).map((feature: MarketFeature, i: number) => (
                      <li key={i}>{feature.title}</li>
                    )) ?? <li>N/A</li>}
                  </ul>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(marketplace.website, "_blank")}
                  disabled={!marketplace.website}
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 