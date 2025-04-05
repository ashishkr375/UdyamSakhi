"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, Settings, UserCircle } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface NavbarProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Navbar({ className, onMenuClick }: NavbarProps) {
  return (
    <div className={cn(
      "h-16 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm",
      className
    )}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-gray-700 dark:text-gray-300"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-x-4 ml-auto">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-purple-100 dark:border-purple-900">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">My Account</p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">Manage your account settings</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/my-profile">
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <UserCircle className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                <span>My Profile</span>
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard">
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/20">
                <Settings className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                <span>Dashboard</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 