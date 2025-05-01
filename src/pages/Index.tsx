
import React, { Suspense, lazy } from "react";
import Hero from "@/components/Hero";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the StockDashboard for better initial loading performance
const LazyStockDashboard = lazy(() => import("@/components/StockDashboard"));

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Stock Dashboard */}
      <ErrorBoundary>
        <Suspense fallback={
          <div className="container p-4">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        }>
          <LazyStockDashboard />
        </Suspense>
      </ErrorBoundary>
      
      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Stock Market Dashboard &copy; {new Date().getFullYear()}</p>
          <p className="text-sm mt-2">
            Powered by Alpha Vantage API. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
