"use client";

import * as React from "react";
import { IBusinessPlan } from "@/models/BusinessPlan";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
import { useRouter } from "next/navigation";
import { FileText, RefreshCw, Calendar, Trash2, Download, Share2, BarChart, Target, SlidersHorizontal, LineChart } from "lucide-react";

interface BusinessPlanViewProps {
  plan: IBusinessPlan;
}

// Add this CSS to your global styles or component
const markdownStyles = {
  heading1: "text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-gray-100",
  heading2: "text-2xl font-semibold mt-6 mb-4 text-gray-900 dark:text-gray-100",
  heading3: "text-xl font-medium mt-4 mb-3 text-gray-900 dark:text-gray-100",
  paragraph: "text-base leading-7 mb-4 text-gray-700 dark:text-gray-300",
  table: "w-full border-collapse border-0 mb-0",
  tableHeader: "bg-purple-50 dark:bg-purple-900/20 px-4 py-2 border border-purple-100 dark:border-purple-900 font-medium text-gray-800 dark:text-gray-200 text-left",
  tableCell: "px-4 py-2 border border-purple-100 dark:border-purple-900 text-gray-700 dark:text-gray-300",
  list: "list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300",
  orderedList: "list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300",
  blockquote: "border-l-4 border-pink-400 dark:border-pink-500 pl-4 italic my-4 text-gray-600 dark:text-gray-400",
  code: "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm text-pink-600 dark:text-pink-400",
  codeBlock: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto text-gray-800 dark:text-gray-200",
};

export function BusinessPlanView({ plan }: BusinessPlanViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState("executiveSummary");
  const [isPending, startTransition] = React.useTransition();
  const [isGenerating, setIsGenerating] = React.useState(false);

  // Enhanced currency formatting for Indian market
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Enhanced content processing
  const processContent = (content: string) => {
    // Add spacing after headings
    let processedContent = content.replace(/^(#{1,6} .+)$/gm, '$1\n\n');
    
    // Convert USD amounts to INR (assuming 1 USD = 83 INR)
    processedContent = processedContent.replace(
      /\$(\d{1,3}(,\d{3})*(\.\d{2})?)/g,
      (match, amount) => {
        const usdAmount = parseFloat(amount.replace(/,/g, ''));
        const inrAmount = usdAmount * 83;
        return formatCurrency(inrAmount);
      }
    );

    // Remove extra newlines before lists to prevent double bullets
    processedContent = processedContent.replace(/\n\n([*-]|\d+\.) /gm, '\n$1 ');

    // Better table handling - preserve table structure without adding extra lines
    // This regex matches table blocks and ensures proper spacing around them
    processedContent = processedContent.replace(
      /(\n\s*\|[\s\S]*?\|.*\n)(\s*[^\|])/g, 
      '$1\n$2'
    );

    // Add extra newline before blockquotes
    processedContent = processedContent.replace(/^>/gm, '\n>');

    return processedContent;
  };

  const handleRegenerateSection = async (section: string) => {
    setIsGenerating(true);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/business-plan/regenerate-section`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: plan._id,
            section,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to regenerate section");
        }

        toast.success("Section regenerated successfully!");
        router.refresh();
      } catch (error) {
        toast.error("Failed to regenerate section. Please try again.");
      } finally {
        setIsGenerating(false);
      }
    });
  };

  const handleDeletePlan = async () => {
    try {
      const response = await fetch(`/api/business-plan/${plan._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete business plan");
      }

      toast.success("Business plan deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete business plan. Please try again.");
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generating Business Plan</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Customizing your business plan section. This may take 2-3 minutes depending on your internet speed.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 dark:border-pink-400 mx-auto"></div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-900 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              {plan.businessName}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              Created on {formatDate(plan.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={`${
              plan.status === "final" 
                ? "bg-gradient-to-r from-pink-500 to-purple-500" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            } px-3 py-1 rounded-full text-xs font-medium`}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete Plan
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                    This action cannot be undone. This will permanently delete your
                    business plan and remove all of its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeletePlan}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              Business Overview
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Key information about your business</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Industry</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Target Market</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.targetMarket}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg overflow-x-auto h-auto">
            <TabsTrigger 
              value="executiveSummary" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm font-medium">Summary</span>
            </TabsTrigger>
            <TabsTrigger 
              value="marketAnalysis" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <BarChart className="h-4 w-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm font-medium">Market</span>
            </TabsTrigger>
            <TabsTrigger 
              value="operations" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <SlidersHorizontal className="h-4 w-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm font-medium">Operations</span>
            </TabsTrigger>
            <TabsTrigger 
              value="marketing" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <Target className="h-4 w-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm font-medium">Marketing</span>
            </TabsTrigger>
            <TabsTrigger 
              value="financialProjections" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <LineChart className="h-4 w-4 flex-shrink-0" />
              <span className="text-[10px] sm:text-sm font-medium">Finance</span>
            </TabsTrigger>
          </TabsList>

          {Object.entries(plan.sections).map(([key, section]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-gray-800 p-4 rounded-xl border border-purple-100 dark:border-purple-900 shadow-sm">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    {key === "executiveSummary" && <FileText className="h-5 w-5 text-pink-600 dark:text-pink-400" />}
                    {key === "marketAnalysis" && <BarChart className="h-5 w-5 text-pink-600 dark:text-pink-400" />}
                    {key === "operations" && <SlidersHorizontal className="h-5 w-5 text-pink-600 dark:text-pink-400" />}
                    {key === "marketing" && <Target className="h-5 w-5 text-pink-600 dark:text-pink-400" />}
                    {key === "financialProjections" && <LineChart className="h-5 w-5 text-pink-600 dark:text-pink-400" />}
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Last updated: {formatDate(section.lastUpdated)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerateSection(key)}
                  disabled={isPending}
                  className="border-gray-200 dark:border-gray-700 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 flex items-center gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </Button>
              </div>
              <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
                <CardContent className="pt-6">
                  <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:mb-4 prose-p:mb-4 prose-table:border prose-td:border prose-th:border prose-th:p-2 prose-td:p-2">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({node, ...props}) => (
                          <h1 className={markdownStyles.heading1} {...props} />
                        ),
                        h2: ({node, ...props}) => (
                          <h2 className={markdownStyles.heading2} {...props} />
                        ),
                        h3: ({node, ...props}) => (
                          <h3 className={markdownStyles.heading3} {...props} />
                        ),
                        p: ({node, ...props}) => (
                          <p className={markdownStyles.paragraph} {...props} />
                        ),
                        table: ({node, ...props}) => (
                          <div className="overflow-x-auto my-6 rounded-md border border-purple-100 dark:border-purple-900">
                            <table className={markdownStyles.table} {...props} />
                          </div>
                        ),
                        th: ({node, ...props}) => (
                          <th className={markdownStyles.tableHeader} {...props} />
                        ),
                        td: ({node, ...props}) => (
                          <td className={markdownStyles.tableCell} {...props} />
                        ),
                        ul: ({node, ...props}) => (
                          <ul className={markdownStyles.list} {...props} />
                        ),
                        ol: ({node, ...props}) => (
                          <ol className={markdownStyles.orderedList} {...props} />
                        ),
                        blockquote: ({node, ...props}) => (
                          <blockquote className={markdownStyles.blockquote} {...props} />
                        ),
                        code: ({node, className, children, ...props}: any) => {
                          const match = /language-(\w+)/.exec(className || '');
                          const isInline = !className;
                          return isInline ? (
                            <code className={markdownStyles.code} {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className={markdownStyles.codeBlock}>
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        },
                      }}
                    >
                      {processContent(section.content)}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            className="border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60 flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button
            onClick={() =>
              toast.message(
                "This feature will be available in the next update!"
              )
            }
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            Share Plan
          </Button>
        </div>
      </div>
    </>
  );
} 