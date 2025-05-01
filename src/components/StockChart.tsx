
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StockHistoricalData } from "@/lib/api";

interface StockChartProps {
  data: StockHistoricalData[];
  symbol: string;
  isLoading?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol, isLoading = false }) => {
  // Calculate domain for y axis with some padding
  const yDomain = useMemo(() => {
    if (!data || data.length === 0) return [0, 100];
    
    const allValues = data.flatMap(d => [d.high, d.low]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1; // 10% padding
    
    return [min - padding, max + padding];
  }, [data]);

  // Format date for x-axis
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Format custom tooltip content
  const renderTooltip = ({ active, payload, label }:any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow-lg border border-gray-200">
          <p className="font-semibold">{formatDate(label)}</p>
          <p className="text-sm text-gray-600">
            Open: <span className="font-medium">${data.open.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Close: <span className="font-medium">${data.close.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            High: <span className="font-medium">${data.high.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-600">
            Low: <span className="font-medium">${data.low.toFixed(2)}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Check if chart should show gain or loss color
  const chartColorClass = useMemo(() => {
    if (!data || data.length < 2) return "text-neutral";
    const firstPrice = data[0].close;
    const lastPrice = data[data.length - 1].close;
    return lastPrice > firstPrice ? "text-gain" : "text-loss";
  }, [data]);
  
  return (
    <Card className="w-full h-[400px] md:h-[500px] shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{symbol} Price History</span>
          <span className={data.length > 1 ? chartColorClass : ""}>
            {data.length > 1 
              ? `${data[0].close > data[data.length-1].close ? "▼" : "▲"} ${data[data.length-1].close.toFixed(2)}`
              : ""}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[320px] md:h-[420px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse text-gray-400">Loading chart data...</div>
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, bottom: 25, left: 0 }}
            >
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
                minTickGap={20}
              />
              <YAxis 
                domain={yDomain} 
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                tick={{ fontSize: 12 }}
                width={60}
              />
              <Tooltip content={renderTooltip} />
              <Legend />
              <Line
                name="Close Price"
                type="monotone"
                dataKey="close"
                stroke="#2563eb"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={false}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockChart;
