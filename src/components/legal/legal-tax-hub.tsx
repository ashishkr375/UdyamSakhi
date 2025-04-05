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
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="compliance">Compliance Checklist</TabsTrigger>
        <TabsTrigger value="guides">Legal & Tax Guides</TabsTrigger>
        <TabsTrigger value="assistant">AI Legal Assistant</TabsTrigger>
      </TabsList>

      <TabsContent value="compliance">
        <ComplianceChecklist 
          items={localItems}
          businessType={businessType}
          state={state}
        />
      </TabsContent>

      <TabsContent value="guides">
        <LegalGuides 
          businessType={businessType}
          state={state}
        />
      </TabsContent>

      <TabsContent value="assistant">
        <LegalAiAssistant 
          businessType={businessType}
          state={state}
        />
      </TabsContent>
    </Tabs>
  );
} 