"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ThemeProvider } from "next-themes";
import { NavigationProgress } from "@/components/navigation-progress";
import ErrorBoundary from "@/components/error-boundary";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <ErrorBoundary>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <NavigationProgress />
          {children}
        </QueryClientProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
} 