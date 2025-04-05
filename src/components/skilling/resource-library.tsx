'use client';

import { useState } from 'react';
import { Search, FileText, Video, Link as LinkIcon, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'guide';
  url: string;
  category: string;
  tags: string[];
}

const MOCK_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Business Plan Writing Guide',
    description: 'A comprehensive guide to writing an effective business plan',
    type: 'guide',
    url: '/resources/business-plan-guide.pdf',
    category: 'Planning',
    tags: ['business plan', 'startup'],
  },
  {
    id: '2',
    title: 'Financial Projection Template',
    description: 'Excel template for creating 3-year financial projections',
    type: 'template',
    url: '/resources/financial-template.xlsx',
    category: 'Finance',
    tags: ['finance', 'planning'],
  },
  {
    id: '3',
    title: 'Marketing Strategy Workshop',
    description: 'Video workshop on creating a marketing strategy',
    type: 'video',
    url: 'https://youtube.com/watch?v=xyz',
    category: 'Marketing',
    tags: ['marketing', 'strategy'],
  },
  // Add more mock resources as needed
];

export function ResourceLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredResources = MOCK_RESOURCES.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && resource.type === activeTab;
  });

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'article':
        return <FileText className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      case 'template':
        return <Download className="h-6 w-6" />;
      case 'guide':
        return <LinkIcon className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="guide">Guides</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
          <TabsTrigger value="video">Videos</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">{resource.category}</Badge>
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    {resource.type === 'template' ? 'Download' : 'View Resource'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 