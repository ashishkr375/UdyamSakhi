'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { CourseCatalog } from '@/components/skilling/course-catalog';
import { MentorBrowser } from '@/components/skilling/mentor-browser';
import { LearningPath } from '@/components/skilling/learning-path';
import { ResourceLibrary } from '@/components/skilling/resource-library';

export default function SkillingCenterPage() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Skilling Center</h1>
        <p className="text-muted-foreground">
          Enhance your entrepreneurial journey with curated courses and expert mentorship
        </p>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="learning-path">Learning Path</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
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
  );
} 