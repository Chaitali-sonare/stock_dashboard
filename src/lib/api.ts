
import { toast } from "@/components/ui/use-toast";

// Use a free API key for Alpha Vantage - this should be stored in an env variable in production
const API_KEY = "demo"; 
const BASE_URL = "https://www.alphavantage.co/query";

export interface StockQuote {
  symbol: string;
  companyName?: string;
  price: number;
  change: number;
  changePercent: number;
  previousClose: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: string;
}

export interface StockHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch stock data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }
    
    if (Object.keys(data).length === 0 || !data["Global Quote"]) {
      throw new Error("No data available for this stock symbol");
    }

    const quote = data["Global Quote"];
    
    return {
      symbol: quote["01. symbol"] || symbol,
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      previousClose: parseFloat(quote["08. previous close"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
      volume: parseInt(quote["06. volume"]),
      lastUpdated: quote["07. latest trading day"] || new Date().toDateString(),
    };
  } catch (error) {
    console.error("Error fetching stock quote:", error);
    toast({
      title: "Error",
      description: `Failed to fetch data for ${symbol}`,
      variant: "destructive",
    });
    throw error;
  }
};

export const fetchStockHistory = async (symbol: string, interval: string = "daily"): Promise<StockHistoricalData[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}?function=TIME_SERIES_${interval.toUpperCase()}&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch historical data: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data["Error Message"]) {
      throw new Error(data["Error Message"]);
    }
    
    const timeSeriesKey = `Time Series (${interval === 'daily' ? 'Daily' : interval.toUpperCase()})`;
    
    if (!data[timeSeriesKey] || Object.keys(data[timeSeriesKey]).length === 0) {
      throw new Error("No historical data available for this stock symbol");
    }

    const timeSeries = data[timeSeriesKey];
    
    // Convert the time series to an array and sort by date
    return Object.entries(timeSeries)
      .map(([date, values]: [string, any]) => ({
        date,
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Get last 30 data points
  } catch (error) {
    console.error("Error fetching historical stock data:", error);
    toast({
      title: "Error",
      description: `Failed to fetch historical data for ${symbol}`,
      variant: "destructive",
    });
    throw error;
  }
};

// For demo purposes, this returns some mock data to minimize API calls
export const DEMO_STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "META", "TSLA", "NVDA", "JPM", "V", "JNJ"];

// Mock data for initial display
export const getMockStockData = (): StockQuote[] => {
  return [
    {
      symbol: "AAPL",
      companyName: "Apple Inc.",
      price: 178.72,
      change: 1.82,
      changePercent: 1.03,
      previousClose: 176.90,
      high: 180.25,
      low: 176.45,
      volume: 78345234,
      lastUpdated: new Date().toDateString(),
    },
    {
      symbol: "MSFT",
      companyName: "Microsoft Corporation",
      price: 337.30,
      change: -2.15,
      changePercent: -0.63,
      previousClose: 339.45,
      high: 340.12,
      low: 335.67,
      volume: 23451234,
      lastUpdated: new Date().toDateString(),
    },
    {
      symbol: "GOOGL",
      companyName: "Alphabet Inc.",
      price: 125.34,
      change: 0.56,
      changePercent: 0.45,
      previousClose: 124.78,
      high: 126.78,
      low: 124.01,
      volume: 19876543,
      lastUpdated: new Date().toDateString(),
    },
    {
      symbol: "AMZN",
      companyName: "Amazon.com, Inc.",
      price: 127.12,
      change: -0.98,
      changePercent: -0.77,
      previousClose: 128.10,
      high: 128.56,
      low: 126.45,
      volume: 32456789,
      lastUpdated: new Date().toDateString(),
    },
    {
      symbol: "TSLA",
      companyName: "Tesla, Inc.",
      price: 245.67,
      change: 5.23,
      changePercent: 2.18,
      previousClose: 240.44,
      high: 247.89,
      low: 240.01,
      volume: 45678901,
      lastUpdated: new Date().toDateString(),
    },
  ];
};

export const getMockHistoricalData = (symbol: string): StockHistoricalData[] => {
  // Generate 30 days of mock data with some randomness
  const today = new Date();
  const data: StockHistoricalData[] = [];
  let basePrice = symbol === "AAPL" ? 175 : symbol === "MSFT" ? 330 : symbol === "GOOGL" ? 125 : symbol === "AMZN" ? 127 : 240;
  
  for (let i = 30; i > 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const priceChange = (Math.random() - 0.48) * 5; // Slightly biased towards growth
    basePrice += priceChange;
    
    const dailyVolatility = basePrice * 0.02; // 2% volatility
    const open = basePrice - dailyVolatility / 2 + Math.random() * dailyVolatility;
    const close = basePrice - dailyVolatility / 2 + Math.random() * dailyVolatility;
    const high = Math.max(open, close) + Math.random() * dailyVolatility;
    const low = Math.min(open, close) - Math.random() * dailyVolatility;
    
    data.push({
      date: date.toISOString().split("T")[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(1000000 + Math.random() * 10000000),
    });
  }
  
  return data;
};
