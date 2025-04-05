import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
      <div className="w-full max-w-[450px] p-8 space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-purple-100 dark:border-purple-900">
        <div className="flex flex-col items-center space-y-3 text-center">
          <Link href="/">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              UdyamSakhi
            </h1>
          </Link>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Empowering Women Entrepreneurs in India
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mt-2"></div>
        </div>
        {children}
      </div>
    </div>
  );
} 