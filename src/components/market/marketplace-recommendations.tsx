"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ExternalLink, Star, PercentCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

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
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardContent className="pt-6">
          <div className="text-center text-gray-600 dark:text-gray-400">
            No business plans found. Please create a business plan first.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Marketplace Recommendations</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Find the best marketplaces for your business</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Select Business Plan</label>
            <Select 
              value={selectedPlan} 
              onValueChange={(value) => {
                setSelectedPlan(value);
                setRecommendationsData(null);
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
            {loading ? "Loading Data..." : (isGenerating ? (hasExistingData ? "Regenerating..." : "Generating...") : (hasExistingData ? "Regenerate Recommendations" : "Get Recommendations"))}
          </Button>

        </CardContent>
      </Card>

      {/* Display Results */}
      {recommendationsData?.recommendations && recommendationsData.recommendations.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendationsData.recommendations.map((marketplace, index) => (
            <Card key={marketplace._id || index} className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20">
                    <img
                      src={marketplace.logo || '/placeholder.svg'} // Fallback logo
                      alt={marketplace.name}
                      className="h-8 w-8 rounded-full object-contain"
                      onError={(e) => (e.currentTarget.src = '/placeholder.svg')} // Handle image load errors
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{marketplace.name}</CardTitle>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span>{marketplace.averageRating?.toFixed(1) || 'N/A'}/5</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center">
                        <PercentCircle className="h-3.5 w-3.5 text-purple-500 dark:text-purple-400 mr-1" />
                        <span>{marketplace.commissionRate}% commission</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    Match Score: {marketplace.matchScore}%
                  </Badge>
                  
                  {marketplace.reasons && marketplace.reasons.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Why It Matches:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 pl-5 list-disc space-y-1">
                        {marketplace.reasons.map((reason, i) => (
                          <li key={i}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {marketplace.features && marketplace.features.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Key Features:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 pl-5 list-disc space-y-1">
                      {marketplace.features.slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature.title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => window.open(marketplace.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 