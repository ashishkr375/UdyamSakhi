"use client";

import * as React from "react";
import { IComplianceItem } from "@/models/ComplianceItem";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { FileText, AlertTriangle, CheckCircle2, Clock, Loader2, RefreshCw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ComplianceChecklistProps {
  items: IComplianceItem[];
  businessType: string;
  state: string;
}

const BUSINESS_TYPES = [
  "Retail",
  "Manufacturing",
  "Services",
  "Technology",
  "Food & Beverage",
  "Healthcare",
  "Education",
  "Construction",
  "Agriculture",
  "Transportation",
  "Other"
];

const STATES = [
  "All",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi"
];

export function ComplianceChecklist({
  items,
  businessType: initialBusinessType,
  state: initialState,
}: ComplianceChecklistProps) {
  const [completedItems, setCompletedItems] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [generatingItems, setGeneratingItems] = React.useState(false);
  const [localItems, setLocalItems] = React.useState<IComplianceItem[]>(items);
  const [selectedBusinessType, setSelectedBusinessType] = React.useState<string>(initialBusinessType);
  const [selectedState, setSelectedState] = React.useState<string>(initialState);
  const [loadingExistingItems, setLoadingExistingItems] = React.useState(false);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  React.useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await fetch("/api/legal/compliance-progress");
        if (response.ok) {
          const data = await response.json();
          setCompletedItems(data.completedItems || []);
        }
      } catch (error) {
        console.error("Failed to load compliance progress:", error);
      }
    };
    loadProgress();
  }, []);

  const updateProgress = async (itemId: string, completed: boolean) => {
    setLoading(true);
    try {
      const response = await fetch("/api/legal/compliance-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, completed }),
      });

      if (!response.ok) throw new Error("Failed to update progress");

      setCompletedItems((prev) =>
        completed
          ? [...prev, itemId]
          : prev.filter((id) => id !== itemId)
      );
      
      toast.success(
        completed ? "Item marked as completed" : "Item marked as incomplete"
      );
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setLoading(false);
    }
  };

  const fetchComplianceItems = async () => {
    if (!selectedBusinessType || !selectedState) {
      toast.error("Please select both business type and state");
      return;
    }

    setLoadingExistingItems(true);
    try {
      const response = await fetch(`/api/legal/compliance-progress?businessType=${selectedBusinessType}&state=${selectedState}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch compliance items");
      }
      
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        setLocalItems(data.items);
        setCompletedItems(data.completedItems || []);
        toast.success(`Found compliance items for ${selectedBusinessType} in ${selectedState}`);
      } else {
        setLocalItems([]);
        toast.info("No compliance items found for this business type and state");
      }
    } catch (error) {
      console.error("Error fetching compliance items:", error);
      toast.error("Failed to fetch compliance items");
    } finally {
      setLoadingExistingItems(false);
    }
  };

  const generateComplianceItems = async () => {
    if (!selectedBusinessType || !selectedState) {
      toast.error("Please select both business type and state");
      return;
    }

    setGeneratingItems(true);
    try {
      const response = await fetch("/api/legal/compliance-items/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessType: selectedBusinessType, 
          state: selectedState 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate compliance items");
      }

      const data = await response.json();
      
      if (data.success && data.items) {
        setLocalItems(data.items);
        toast.success("Generated compliance requirements for your business");
        // Reload progress to get the latest completed items
        const progressResponse = await fetch("/api/legal/compliance-progress");
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setCompletedItems(progressData.completedItems || []);
        }
      } else {
        throw new Error("No items were generated");
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message || "Failed to generate compliance items"}`);
      console.error(error);
    } finally {
      setGeneratingItems(false);
    }
  };

  const progress = localItems.length > 0
    ? (completedItems.length / localItems.length) * 100
    : 0;

  const categories = Array.from(
    new Set(localItems.map((item) => item.category))
  );

  return (
    <div className="space-y-6">
      {/* Business Type and State Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Select your business type and state to find applicable compliance requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Type</label>
              <Select 
                value={selectedBusinessType} 
                onValueChange={setSelectedBusinessType}
                disabled={generatingItems || loadingExistingItems}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State</label>
              <Select 
                value={selectedState} 
                onValueChange={setSelectedState}
                disabled={generatingItems || loadingExistingItems}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={fetchComplianceItems}
            disabled={!selectedBusinessType || !selectedState || loadingExistingItems || generatingItems}
            variant="outline"
          >
            {loadingExistingItems && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loadingExistingItems ? "Loading..." : "Find Requirements"}
          </Button>
          <Button
            onClick={generateComplianceItems}
            disabled={!selectedBusinessType || !selectedState || generatingItems || loadingExistingItems}
          >
            {generatingItems && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {generatingItems ? "Generating..." : "Generate New Requirements"}
          </Button>
        </CardFooter>
      </Card>

      {/* Progress Card */}
      {localItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Progress</CardTitle>
            <CardDescription>
              Track your compliance requirements for {selectedBusinessType} in {selectedState}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Items Card */}
      {localItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center space-y-4">
            <div className="text-center text-muted-foreground mb-4">
              {selectedBusinessType && selectedState ? 
                `No compliance requirements found for ${selectedBusinessType} in ${selectedState}. Please generate new requirements.` :
                "Please select your business type and state, then find or generate compliance requirements."
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Items by Category */}
      {localItems.length > 0 && categories.map((category) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              Required compliance items for {category.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {localItems
              .filter((item) => item.category === category)
              .map((item) => (
                <div
                  key={item._id}
                  className="flex items-start space-x-4"
                >
                  <Checkbox
                    id={item._id}
                    checked={completedItems.includes(item._id)}
                    onCheckedChange={(checked) =>
                      updateProgress(item._id, checked as boolean)
                    }
                    disabled={loading}
                  />
                  <div className="space-y-1">
                    <label
                      htmlFor={item._id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.title}
                    </label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    {item.dueDate && (
                      <p className="text-sm text-muted-foreground">
                        Due by: {new Date(item.dueDate).toLocaleDateString()}
                      </p>
                    )}
                    {item.link && (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-sm"
                        onClick={() => window.open(item.link, "_blank")}
                      >
                        Learn more
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 