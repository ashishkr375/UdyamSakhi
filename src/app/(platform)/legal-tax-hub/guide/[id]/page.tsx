import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { guides } from "@/app/api/legal/guides/route";
import ReactMarkdown from "react-markdown";

interface GuidePageProps {
  params: {
    id: string;
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guides.find((g) => g.id === params.id);

  if (!guide) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{guide.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: {new Date(guide.lastUpdated).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 