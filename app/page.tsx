"use client";

import { useEffect, Suspense } from "react";
import PublicLayout from "@/components/layouts/PublicLayout";
import Hero from "@/components/Hero";

function HomePageContent() {
  useEffect(() => {
    // Check if this is a redirect from OAuth callback
    // If there's a token in localStorage but page just loaded, ensure refresh
    const checkAndRefresh = () => {
      const token = localStorage.getItem("access_token");
      const fromAuth = sessionStorage.getItem("fromAuthCallback");
      const hasRefreshed = sessionStorage.getItem("hasRefreshedAfterAuth");
      
      // If we have a token and just came from auth callback, but haven't refreshed yet
      if (token && fromAuth && !hasRefreshed) {
        // Mark that we've refreshed to prevent infinite loop
        sessionStorage.setItem("hasRefreshedAfterAuth", "true");
        // Clear the fromAuth flag
        sessionStorage.removeItem("fromAuthCallback");
        
        // Small delay to ensure everything is ready, then reload
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else if (hasRefreshed) {
        // After refresh, clean up the flag
        sessionStorage.removeItem("hasRefreshedAfterAuth");
        // Dispatch event to ensure AuthContext picks up the token
        window.dispatchEvent(new Event("tokenSet"));
      }
    };

    checkAndRefresh();
  }, []);

  return (
    <PublicLayout>
      <Hero />
    </PublicLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
