'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ProgressBar from '@badrap/bar-of-progress';

function NavigationProgressContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create and configure progress bar when component mounts
    const progress = new ProgressBar({
      size: 3,
      color: "#ec4899",
      className: "bar-of-progress",
      delay: 80,
    });

    // Start progress
    progress.start();
    
    // Complete after a small delay
    const timer = setTimeout(() => {
      progress.finish();
    }, 500);
    
    // Handle cleanup
    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams]); // Rerun when route changes

  // Handle clicks on links to start progress early
  useEffect(() => {
    const progress = new ProgressBar({
      size: 5,
      color: "#ec4899",
      className: "bar-of-progress",
      delay: 80,
    });

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && 
          anchor.href && 
          (!anchor.target || anchor.target === '_self') && 
          !anchor.download && 
          anchor.href.startsWith(window.location.origin)) {
        progress.start();
      }
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  // No visible UI needed as the progress bar injects itself
  return null;
}

export function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <NavigationProgressContent />
    </Suspense>
  );
} 