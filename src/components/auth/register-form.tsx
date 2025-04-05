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
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Something went wrong");
        }

        toast.success("Registration successful! Please log in.");
        router.push("/login");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
            Create your account
          </h2>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  className="border-gray-300 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-purple-300 dark:focus:ring-purple-700" 
                  {...field} 
                />
              </FormControl>
              <FormMessage className="text-pink-600 dark:text-pink-400" />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Create a password" 
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
              <FormLabel className="text-gray-700 dark:text-gray-300">Confirm Password</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Confirm your password" 
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
          {isPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium">
            Log in
          </Link>
        </p>
      </div>
    </Form>
  );
} 