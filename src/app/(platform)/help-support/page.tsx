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
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or reach out to our support team
        </p>
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tutorials
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Us
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