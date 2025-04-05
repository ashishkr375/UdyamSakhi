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
import { ExternalLink, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Resource {
  title: string;
  description: string;
  type: "article" | "video" | "course";
  link: string;
  duration?: string;
  provider: string;
  topics: string[];
}

const financialResources: Resource[] = [
  {
    title: "Understanding Business Finance Basics",
    description: "Learn the fundamental concepts of business finance, including cash flow, profit & loss, and balance sheets.",
    type: "course",
    link: "https://example.com/finance-basics",
    duration: "2 hours",
    provider: "Small Business Academy",
    topics: ["Financial Statements", "Cash Flow", "Budgeting"],
  },
  {
    title: "Managing Working Capital",
    description: "Essential strategies for effective working capital management in small businesses.",
    type: "article",
    link: "https://example.com/working-capital",
    provider: "Business Finance Hub",
    topics: ["Working Capital", "Cash Management", "Inventory"],
  },
  {
    title: "Financial Planning for Growth",
    description: "Learn how to create a solid financial plan to support your business growth objectives.",
    type: "video",
    link: "https://example.com/growth-planning",
    duration: "45 minutes",
    provider: "Entrepreneur's Guide",
    topics: ["Growth Strategy", "Financial Planning", "Risk Management"],
  },
];

export function FinancialLiteracy() {
  const [selectedTopic, setSelectedTopic] = React.useState<string | null>(null);

  const filteredResources = selectedTopic
    ? financialResources.filter((resource) =>
        resource.topics.includes(selectedTopic)
      )
    : financialResources;

  const allTopics = Array.from(
    new Set(financialResources.flatMap((resource) => resource.topics))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {allTopics.map((topic) => (
          <Button
            key={topic}
            variant={selectedTopic === topic ? "default" : "outline"}
            onClick={() =>
              setSelectedTopic(selectedTopic === topic ? null : topic)
            }
            size="sm"
          >
            {topic}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.provider}</CardDescription>
                </div>
                {resource.type === "video" && (
                  <PlayCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {resource.topics.map((topic) => (
                    <Badge key={topic} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
                {resource.duration && (
                  <p className="text-sm text-muted-foreground">
                    Duration: {resource.duration}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(resource.link, "_blank")}
                >
                  {resource.type === "course"
                    ? "Start Course"
                    : resource.type === "video"
                    ? "Watch Video"
                    : "Read Article"}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No Resources Found</h3>
          <p className="text-muted-foreground">
            Try selecting a different topic or check back later for new content
          </p>
        </div>
      )}
    </div>
  );
} 