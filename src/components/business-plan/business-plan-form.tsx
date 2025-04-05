"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Briefcase, Target } from "lucide-react";

const formSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  industry: z.enum([
    "Manufacturing",
    "Services",
    "Retail",
    "Technology",
    "Agriculture",
    "Other",
  ]),
  businessIdea: z
    .string()
    .min(50, "Business idea must be at least 50 characters")
    .max(1000, "Business idea must not exceed 1000 characters"),
  targetMarket: z
    .string()
    .min(20, "Target market description must be at least 20 characters")
    .max(500, "Target market description must not exceed 500 characters"),
});

export function BusinessPlanForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "Manufacturing",
      businessIdea: "",
      targetMarket: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/business-plan/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to generate business plan");
        }

        toast.success("Business plan generation started!");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      }
    });
  }

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Generating Business Plan</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Analyzing your business details and creating your plan. This may take 2-3 minutes.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 dark:border-pink-400 mx-auto"></div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-lg border border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              Business Information
            </h2>
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Business Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your business name" 
                      {...field} 
                      className="border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-purple-100 dark:border-purple-900">
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Services">Services</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Agriculture">Agriculture</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <div className="rounded-lg border border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 p-6 space-y-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Business Details
            </h2>
            <FormField
              control={form.control}
              name="businessIdea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">Business Idea</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your business idea in detail..."
                      className="min-h-[100px] border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetMarket"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                    Target Market
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your target market..."
                      className="min-h-[100px] border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 dark:text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white" 
            disabled={isPending}
          >
            {isPending ? "Generating Plan..." : "Generate Business Plan"}
          </Button>
        </form>
      </Form>
    </>
  );
} 