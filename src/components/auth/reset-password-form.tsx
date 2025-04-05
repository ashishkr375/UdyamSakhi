"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Suspense } from "react";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            password: values.password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }

        toast.success("Password reset successful! Please log in with your new password.");
        router.push("/login");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-gray-600 dark:text-gray-400">Invalid or expired reset token.</p>
        <Button 
          asChild
          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800"
        >
          <Link href="/forgot-password">Request New Reset Link</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-3 text-center mb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-200">
            Reset Password
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Enter your new password below.
          </p>
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">New Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter new password" 
                  type="password" 
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-300 dark:focus:ring-purple-700" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-pink-600 dark:text-pink-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Confirm New Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Confirm new password" 
                  type="password" 
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
          {isPending ? "Resetting password..." : "Reset Password"}
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

export function ResetPasswordForm() {
  return (
    <Suspense fallback={
      <div className="text-center space-y-4">
        <p>Loading reset form...</p>
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
} 