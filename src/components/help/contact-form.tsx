'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Mail, Tag, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  category: z.string().min(1, 'Category is required'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must not exceed 1000 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      category: '',
      message: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      toast.success('Message sent successfully', {
        description: 'We will get back to you as soon as possible.',
      });

      form.reset();
    } catch (error) {
      toast.error('Error sending message', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                  Subject
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Brief description of your issue" 
                    {...field} 
                    className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                  />
                </FormControl>
                <FormMessage className="text-pink-600 dark:text-pink-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  Category
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-purple-100 dark:border-purple-900">
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="account">Account Related</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-pink-600 dark:text-pink-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-pink-500 dark:text-pink-400" />
                  Priority
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-purple-100 dark:border-purple-900">
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Low</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not urgent</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Medium</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Needs attention</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">High</Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Urgent matter</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-pink-600 dark:text-pink-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900 dark:text-gray-100">Message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe your issue in detail"
                    className="min-h-[150px] border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-pink-600 dark:text-pink-400" />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
} 