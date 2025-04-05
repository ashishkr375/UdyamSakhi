"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }

        toast.success("Password reset link sent to your email!");
        router.push("/login");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3 text-center mb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your email" 
                  type="email" 
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-300 dark:focus:ring-purple-700" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-pink-600 dark:text-pink-400" />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800 mt-2" 
          disabled={isPending}
        >
          {isPending ? "Sending link..." : "Send Reset Link"}
        </Button>
        <div className="text-center text-sm mt-6">
          <Link href="/login" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium">
            Back to login
          </Link>
        </div>
      </form>
    </Form>
  );
} 