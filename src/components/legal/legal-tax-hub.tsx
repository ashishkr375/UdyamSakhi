"use client";

import * as React from "react";
import { IComplianceItem } from "@/models/ComplianceItem";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ComplianceChecklist } from "./compliance-checklist";
import { LegalGuides } from "./legal-guides";
import { LegalAiAssistant } from "./legal-ai-assistant";
import { Scale, BookOpen, BrainCircuit } from "lucide-react";

interface LegalTaxHubProps {
  complianceItems: IComplianceItem[];
  businessType: string;
  state: string;
}

export function LegalTaxHub({ complianceItems, businessType, state }: LegalTaxHubProps) {
  const [activeTab, setActiveTab] = React.useState("compliance");
  const [localItems, setLocalItems] = React.useState<IComplianceItem[]>(complianceItems);
  
  React.useEffect(() => {
    setLocalItems(complianceItems);
  }, [complianceItems]);

  // Function to handle refresh of compliance items
  const refreshComplianceItems = (newItems: IComplianceItem[]) => {
    setLocalItems(newItems);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-900 p-1">
        <TabsTrigger 
          value="compliance" 
          className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
        >
          <Scale className="h-4 w-4" />
          <span className="hidden sm:inline">Compliance Checklist</span>
          <span className="sm:hidden">Compliance</span>
        </TabsTrigger>
        <TabsTrigger 
          value="guides" 
          className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
        >
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Legal & Tax Guides</span>
          <span className="sm:hidden">Guides</span>
        </TabsTrigger>
        <TabsTrigger 
          value="assistant" 
          className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
        >
          <BrainCircuit className="h-4 w-4" />
          <span className="hidden sm:inline">AI Legal Assistant</span>
          <span className="sm:hidden">Assistant</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="compliance" className="bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-900 p-5 shadow-sm">
        <ComplianceChecklist 
          items={localItems}
          businessType={businessType}
          state={state}
        />
      </TabsContent>

      <TabsContent value="guides" className="bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-900 p-5 shadow-sm">
        <LegalGuides 
          businessType={businessType}
          state={state}
        />
      </TabsContent>

      <TabsContent value="assistant" className="bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-900 p-5 shadow-sm">
        <LegalAiAssistant 
          businessType={businessType}
          state={state}
        />
      </TabsContent>
    </Tabs>
  );
} 