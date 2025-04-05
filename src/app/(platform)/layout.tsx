import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar className="hidden md:flex w-64 border-r" />
      <div className="flex-1">
        <Navbar className="border-b" />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 