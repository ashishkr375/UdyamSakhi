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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800",
      className
    )}>
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <Link href="/dashboard">
          <img src="/logo.png" alt="UdyamSakhi Logo" className="h-7 w-auto md:h-10" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Empowering Women Entrepreneurs
          </p>
        </Link>
        
        {onClose && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-x-2 text-sm font-medium px-3 py-2.5 rounded-lg transition-colors",
                isActive
                  ? "bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 dark:from-pink-900/20 dark:to-purple-900/20 dark:text-pink-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60"
              )}
              onClick={() => {
                if (onClose && window.innerWidth < 768) {
                  onClose();
                }
              }}
            >
              <route.icon className={cn(
                "w-5 h-5",
                isActive 
                  ? "text-pink-600 dark:text-pink-400" 
                  : "text-gray-500 dark:text-gray-400"
              )} />
              {route.label}
            </Link>
          );
        })}
      </div>
      <div className="p-4 mt-auto border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-lg p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            Need Help?
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Visit our help center for guidance on using UdyamSakhi
          </p>
          <Link 
            href="/help-support"
            className="inline-block mt-2 text-xs font-medium text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300"
          >
            Get Support →
          </Link>
        </div>
      </div>
    </div>
  );
} 