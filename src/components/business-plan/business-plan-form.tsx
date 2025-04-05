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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-lg border p-4 space-y-6">
          <h2 className="text-xl font-semibold">Business Information</h2>
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your business name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-lg border p-4 space-y-6">
          <h2 className="text-xl font-semibold">Business Details</h2>
          <FormField
            control={form.control}
            name="businessIdea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Idea</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your business idea in detail..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetMarket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Market</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your target market..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Generating Plan..." : "Generate Business Plan"}
        </Button>
      </form>
    </Form>
  );
} 