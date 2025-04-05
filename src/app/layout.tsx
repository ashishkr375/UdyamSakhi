import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "UdyamSakhi - Empowering Women Entrepreneurs",
  description: "AI-powered platform for women entrepreneurs in India providing business planning, financial guidance, and skill development.",
  keywords: ["women entrepreneurs", "business planning", "startup india", "udyam", "AI business tools"],
  metadataBase: new URL('https://udyamsakhi.org'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://udyamsakhi.org',
    title: 'UdyamSakhi - Empowering Women Entrepreneurs in India',
    description: 'AI-powered platform helping women entrepreneurs in India with business planning, funding, legal support, and skill development',
    siteName: 'UdyamSakhi',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'UdyamSakhi - Empowering Women Entrepreneurs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UdyamSakhi - Empowering Women Entrepreneurs in India',
    description: 'AI-powered platform helping women entrepreneurs in India',
    images: ['/banner.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={`${geist.variable} font-sans antialiased`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
