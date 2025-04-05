'use client';

import { useState } from 'react';
import { Search, HelpCircle, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create a business plan using the AI assistant?',
    answer: 'To create a business plan, navigate to the "My Business Plan" section and click on "Create New Plan". Fill in your business idea and details in the form, and our AI assistant will generate a comprehensive plan for you. You can then review and edit the generated plan as needed.',
    category: 'Business Planning',
  },
  {
    id: '2',
    question: 'What documents do I need to register my business?',
    answer: 'The required documents vary based on your business type and location. In general, you\'ll need proof of identity, address proof, PAN card, and business-specific documents. Check the "Legal & Tax Hub" section for a personalized checklist based on your business details.',
    category: 'Legal & Compliance',
  },
  {
    id: '3',
    question: 'How can I connect with a mentor?',
    answer: 'Visit the "Skilling Center" and go to the "Mentors" tab. You can browse available mentors, filter by expertise and language, and book a session with your chosen mentor. Make sure to complete your profile before booking a session.',
    category: 'Mentorship',
  },
  {
    id: '4',
    question: 'How do I track my learning progress?',
    answer: 'Your learning progress is automatically tracked in the "Learning Path" section of the Skilling Center. Here you can see your enrolled courses, completed modules, achievements, and mentor session history.',
    category: 'Learning',
  },
  {
    id: '5',
    question: 'What funding options are available for my business?',
    answer: 'The "Funding Navigator" section analyzes your business plan and profile to recommend suitable funding options. This includes government schemes, bank loans, and other financial instruments. Each recommendation comes with eligibility criteria and application guidance.',
    category: 'Finance',
  },
  // Add more FAQ items as needed
];

const CATEGORIES = Array.from(new Set(FAQ_DATA.map(item => item.category)));

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-pink-500 dark:text-pink-400" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-purple-100 dark:border-purple-900">
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredFAQs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-2">
          {filteredFAQs.map((faq) => (
            <AccordionItem 
              key={faq.id} 
              value={faq.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="text-left px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100 font-medium">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                  <div>
                    {faq.question}
                    <Badge 
                      className="ml-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
                    >
                      {faq.category}
                    </Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-5 py-4 pl-12">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <HelpCircle className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-gray-500 dark:text-gray-400">No matching questions found</p>
        </div>
      )}
    </div>
  );
} 