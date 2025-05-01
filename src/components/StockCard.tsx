
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { StockQuote } from "@/lib/api";

interface StockCardProps {
  stock: StockQuote;
  onClick?: () => void;
  isSelected?: boolean;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick, isSelected = false }) => {
  const isPositive = stock.changePercent > 0;
  const isNeutral = stock.changePercent === 0;
  
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? "border-2 border-primary shadow-lg" 
          : "border border-gray-200"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{stock.symbol}</h3>
            {stock.companyName && (
              <p className="text-sm text-gray-600 truncate max-w-[200px]">
                {stock.companyName}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">${stock.price.toFixed(2)}</p>
            <div 
              className={`flex items-center justify-end ${
                isPositive 
                  ? "text-gain" 
                  : isNeutral 
                    ? "text-neutral" 
                    : "text-loss"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : isNeutral ? null : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            <p>Prev Close: ${stock.previousClose.toFixed(2)}</p>
            <p>Volume: {stock.volume.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p>High: ${stock.high.toFixed(2)}</p>
            <p>Low: ${stock.low.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockCard;
