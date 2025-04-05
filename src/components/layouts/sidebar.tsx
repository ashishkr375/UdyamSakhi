"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  PiggyBank,
  Scale,
  ShoppingBag,
  GraduationCap,
  UserCircle,
  HelpCircle,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Business Plan",
    icon: FileText,
    href: "/my-business-plan",
  },
  {
    label: "Funding Navigator",
    icon: PiggyBank,
    href: "/funding-navigator",
  },
  {
    label: "Legal & Tax Hub",
    icon: Scale,
    href: "/legal-tax-hub",
  },
  {
    label: "Market Access",
    icon: ShoppingBag,
    href: "/market-access",
  },
  {
    label: "Skilling Center",
    icon: GraduationCap,
    href: "/skilling-center",
  },
  {
    label: "My Profile",
    icon: UserCircle,
    href: "/my-profile",
  },
  {
    label: "Help & Support",
    icon: HelpCircle,
    href: "/help-support",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">UdyamSakhi</h1>
      </div>
      <div className="flex-1 p-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors",
              pathname === route.href
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <route.icon className="w-5 h-5" />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
} 