
import React, { useState, useCallback, lazy, Suspense } from "react";
import { DEMO_STOCK_SYMBOLS } from "@/lib/api";
import { useStockList } from "@/hooks/useStocks";
import StockCard from "@/components/StockCard";
import SearchBar from "@/components/SearchBar";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const LazyStockChart = lazy(() => import("@/components/StockChart"));

const StockDashboard: React.FC = () => {
  const {
    stockQuotes,
    historicalData,
    selectedSymbol,
    searchQuery,
    isLoading,
    setSelectedSymbol,
    setSearchQuery,
  } = useStockList(DEMO_STOCK_SYMBOLS.slice(0, 5));

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  return (
    <section id="stocks-section" className="py-12 bg-white">
      <div className="container px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-6">Market Overview</h2>
        
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Search by symbol or company name..." />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock list section */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-lg mb-4">Stocks</h3>
            
            <ErrorBoundary>
              {isLoading ? (
                // Loading skeletons for stock cards
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton className="h-[140px] w-full rounded-lg" />
                  </div>
                ))
              ) : stockQuotes && stockQuotes.length > 0 ? (
                stockQuotes.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    isSelected={selectedSymbol === stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                  />
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No stocks found</p>
                  <Button
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </ErrorBoundary>
          </div>
          
          {/* Chart section */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-lg" />}>
                {selectedSymbol && historicalData ? (
                  <LazyStockChart
                    data={historicalData}
                    symbol={selectedSymbol}
                  />
                ) : (
                  <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-500">
                      {selectedSymbol 
                        ? "Loading chart data..."
                        : "Select a stock to view its chart"}
                    </p>
                  </div>
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StockDashboard;
