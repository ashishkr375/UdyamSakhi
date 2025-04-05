'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CourseCatalog } from '@/components/skilling/course-catalog';
import { MentorBrowser } from '@/components/skilling/mentor-browser';
import { LearningPath } from '@/components/skilling/learning-path';
import { ResourceLibrary } from '@/components/skilling/resource-library';
import { GraduationCap, Users, Compass, BookOpen } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function SkillingCenterPage() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            Skilling Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enhance your entrepreneurial journey with curated courses and expert mentorship
          </p>
        </div>

        <Card className="p-6 border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-gray-900 p-1">
              <TabsTrigger 
                value="courses" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mentors" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Mentors</span>
              </TabsTrigger>
              <TabsTrigger 
                value="learning-path" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
              >
                <Compass className="h-4 w-4" />
                <span className="hidden sm:inline">Learning Path</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Resources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <CourseCatalog />
            </TabsContent>

            <TabsContent value="mentors" className="mt-6">
              <MentorBrowser />
            </TabsContent>

            <TabsContent value="learning-path" className="mt-6">
              <LearningPath />
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <ResourceLibrary />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </QueryClientProvider>
  );
} 