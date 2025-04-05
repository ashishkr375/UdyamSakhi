"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layouts/sidebar";
import { Navbar } from "@/components/layouts/navbar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const toggleSidebar = () => {
    setShowMobileSidebar(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <Sidebar 
        className={`${showMobileSidebar ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} md:flex w-64 shadow-sm`} 
        onClose={() => setShowMobileSidebar(false)}
      />
      {showMobileSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setShowMobileSidebar(false)}
        />
      )}
      <div className="flex-1">
        <Navbar onMenuClick={toggleSidebar} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
} 