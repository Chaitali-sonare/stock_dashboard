
import { useQuery } from "@tanstack/react-query";
import { fetchStockQuote, fetchStockHistory, getMockStockData, getMockHistoricalData, StockQuote, StockHistoricalData } from "@/lib/api";
import { useState, useCallback } from "react";

// Custom hook to fetch stock quotes
export const useStockQuote = (symbol: string, enabled = true) => {
  return useQuery({
    queryKey: ['stockQuote', symbol],
    queryFn: () => fetchStockQuote(symbol),
    enabled: !!symbol && enabled,
    staleTime: 60 * 1000, // 1 minute
    retry: 1,
  });
};

// Custom hook to fetch stock history
export const useStockHistory = (symbol: string, interval = 'daily', enabled = true) => {
  return useQuery({
    queryKey: ['stockHistory', symbol, interval],
    queryFn: () => fetchStockHistory(symbol, interval),
    enabled: !!symbol && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to manage a list of stock quotes
export const useStockList = (initialSymbols: string[] = []) => {
  const [symbols, setSymbols] = useState<string[]>(initialSymbols);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(initialSymbols[0] || null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data for all symbols
  const { data: stockQuotes, isLoading, error } = useQuery({
    queryKey: ['stockList', symbols],
    queryFn: async () => {
      // For demo purposes, use mock data to avoid API rate limits
      // In production, this would call the API for each symbol
      return getMockStockData();
    },
    enabled: symbols.length > 0,
  });

  // Fetch historical data for selected symbol
  const { data: historicalData } = useQuery({
    queryKey: ['historicalData', selectedSymbol],
    queryFn: () => {
      // For demo purposes, use mock data to avoid API rate limits
      return getMockHistoricalData(selectedSymbol || "");
    },
    enabled: !!selectedSymbol,
  });

  // Filter stocks based on search query
  const filteredStocks = useCallback(() => {
    if (!stockQuotes) return [];
    if (!searchQuery) return stockQuotes;
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    return stockQuotes.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowerCaseQuery) || 
        (stock.companyName && stock.companyName.toLowerCase().includes(lowerCaseQuery))
    );
  }, [stockQuotes, searchQuery]);

  // Add a stock symbol to the list
  const addSymbol = useCallback((newSymbol: string) => {
    if (newSymbol && !symbols.includes(newSymbol.toUpperCase())) {
      setSymbols(prev => [...prev, newSymbol.toUpperCase()]);
    }
  }, [symbols]);

  // Remove a stock symbol from the list
  const removeSymbol = useCallback((symbolToRemove: string) => {
    setSymbols(prev => prev.filter(s => s !== symbolToRemove));
    if (selectedSymbol === symbolToRemove) {
      setSelectedSymbol(symbols.filter(s => s !== symbolToRemove)[0] || null);
    }
  }, [symbols, selectedSymbol]);

  return {
    symbols,
    selectedSymbol,
    searchQuery,
    stockQuotes: filteredStocks(),
    historicalData,
    isLoading,
    error,
    setSelectedSymbol,
    setSearchQuery,
    addSymbol,
    removeSymbol,
  };
};
