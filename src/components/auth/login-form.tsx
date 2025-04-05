"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
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
  password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        toast.success("Logged in successfully!");
        router.push("/dashboard");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Invalid credentials");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
            Log in to your account
          </h2>
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel className="text-gray-700 dark:text-gray-300">Password</FormLabel>
                <Link href="/forgot-password" className="text-xs text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <Input 
                  placeholder="Enter your password" 
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
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-800" 
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Log In"}
        </Button>
      </form>
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 font-medium">
            Create one
          </Link>
        </p>
      </div>
    </Form>
  );
} 