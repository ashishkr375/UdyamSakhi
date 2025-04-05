'use client';

import { useState } from 'react';
import { Search, FileText, Video, Link as LinkIcon, Download, BookOpen } from 'lucide-react';
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
        return <FileText className="h-6 w-6 text-pink-500 dark:text-pink-400" />;
      case 'video':
        return <Video className="h-6 w-6 text-purple-500 dark:text-purple-400" />;
      case 'template':
        return <Download className="h-6 w-6 text-pink-500 dark:text-pink-400" />;
      case 'guide':
        return <BookOpen className="h-6 w-6 text-purple-500 dark:text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 bg-gray-100 dark:bg-gray-900 p-1">
          <TabsTrigger 
            value="all"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
          >
            All Resources
          </TabsTrigger>
          <TabsTrigger 
            value="guide"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guides</span>
          </TabsTrigger>
          <TabsTrigger 
            value="template"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger 
            value="video"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
          >
            <Video className="h-4 w-4" />
            <span className="hidden sm:inline">Videos</span>
          </TabsTrigger>
          <TabsTrigger 
            value="article"
            className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Articles</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 p-2">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{resource.title}</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">{resource.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30">
                      {resource.category}
                    </Badge>
                    {resource.tags.map((tag) => (
                      <Badge key={tag} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
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