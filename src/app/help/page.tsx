'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { FAQ } from '@/components/help/faq';
import { Tutorials } from '@/components/help/tutorials';
import { ContactForm } from '@/components/help/contact-form';
import { HelpCircle, BookOpen, Mail } from 'lucide-react';

export default function HelpSupportPage() {
  const [activeTab, setActiveTab] = useState('faq');

  return (
    <div className="container mx-auto py-8 px-2 md:px-4 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          Help & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find answers to common questions or reach out to our support team
        </p>
      </div>

      <Card className="p-4 sm:p-6 border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg h-auto">
            <TabsTrigger 
              value="faq" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <HelpCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">FAQs</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tutorials" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Tutorials</span>
            </TabsTrigger>
            <TabsTrigger 
              value="contact" 
              className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
            >
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium">Contact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="mt-6">
            <FAQ />
          </TabsContent>

          <TabsContent value="tutorials" className="mt-6">
            <Tutorials />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <ContactForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 