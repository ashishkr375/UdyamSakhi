"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollText, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LegalGuidesProps {
  businessType: string;
  state: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string;
  category: "registration" | "taxation";
}

export function LegalGuides({ businessType, state }: LegalGuidesProps) {
  const [guides, setGuides] = React.useState<Guide[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("registration");

  React.useEffect(() => {
    const loadGuides = async () => {
      try {
        const response = await fetch(
          `/api/legal/guides?businessType=${businessType}&state=${state}`
        );
        if (response.ok) {
          const data = await response.json();
          setGuides(data.guides);
        }
      } catch (error) {
        console.error("Failed to load guides:", error);
      } finally {
        setLoading(false);
      }
    };
    loadGuides();
  }, [businessType, state]);

  const registrationGuides = guides.filter(
    (guide) => guide.category === "registration"
  );
  const taxationGuides = guides.filter(
    (guide) => guide.category === "taxation"
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Loading guides...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (guides.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            No registration or taxation guides are available at the moment
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="registration">
          <ScrollText className="mr-2 h-4 w-4" />
          Registration Guides
        </TabsTrigger>
        <TabsTrigger value="taxation">
          <FileText className="mr-2 h-4 w-4" />
          Taxation Guides
        </TabsTrigger>
      </TabsList>

      <TabsContent value="registration">
        <div className="grid gap-4 md:grid-cols-2">
          {registrationGuides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader>
                <CardTitle>{guide.title}</CardTitle>
                <CardDescription>
                  Last updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {guide.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    window.open(`/guides/${guide.id}`, "_blank")
                  }
                >
                  Read Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="taxation">
        <div className="grid gap-4 md:grid-cols-2">
          {taxationGuides.map((guide) => (
            <Card key={guide.id}>
              <CardHeader>
                <CardTitle>{guide.title}</CardTitle>
                <CardDescription>
                  Last updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {guide.description}
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    window.open(`/guides/${guide.id}`, "_blank")
                  }
                >
                  Read Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}