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

interface BusinessPlanViewProps {
  plan: IBusinessPlan;
}

// Add this CSS to your global styles or component
const markdownStyles = {
  heading1: "text-3xl font-bold mt-8 mb-6",
  heading2: "text-2xl font-semibold mt-6 mb-4",
  heading3: "text-xl font-medium mt-4 mb-3",
  paragraph: "text-base leading-7 mb-4",
  table: "w-full border-collapse border border-border mb-6",
  tableHeader: "bg-muted px-4 py-2 border border-border font-medium",
  tableCell: "px-4 py-2 border border-border",
  list: "list-disc list-inside mb-4 space-y-2",
  orderedList: "list-decimal list-inside mb-4 space-y-2",
  blockquote: "border-l-4 border-primary pl-4 italic my-4",
  code: "bg-muted rounded px-1 py-0.5 font-mono text-sm",
  codeBlock: "bg-muted p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto",
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

    // Add extra newline before lists
    processedContent = processedContent.replace(/^([*-]|\d+\.) /gm, '\n$&');

    // Add extra newline before tables
    processedContent = processedContent.replace(/^\|/gm, '\n|');

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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold">Generating Business Plan</h3>
            <p className="text-muted-foreground">
              Customizing your business plan section. This may take 2-3 minutes depending on your internet speed.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{plan.businessName}</h2>
            <p className="text-muted-foreground">
              Created on {formatDate(plan.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={plan.status === "final" ? "default" : "secondary"}>
              {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
            </Badge>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">Delete Plan</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    business plan and remove all of its data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePlan}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Business Overview</CardTitle>
            <CardDescription>Key information about your business</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Industry</p>
              <p className="text-sm text-muted-foreground">{plan.industry}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Target Market</p>
              <p className="text-sm text-muted-foreground">{plan.targetMarket}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="executiveSummary">Summary</TabsTrigger>
            <TabsTrigger value="marketAnalysis">Market</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="financialProjections">Finance</TabsTrigger>
          </TabsList>

          {Object.entries(plan.sections).map(([key, section]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {formatDate(section.lastUpdated)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegenerateSection(key)}
                  disabled={isPending}
                >
                  Regenerate
                </Button>
              </div>
              <Card>
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
                          <div className="overflow-x-auto">
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
          <Button variant="outline">Download PDF</Button>
          <Button
            onClick={() =>
              toast.message(
                "This feature will be available in the next update!"
              )
            }
          >
            Share Plan
          </Button>
        </div>
      </div>
    </>
  );
} 