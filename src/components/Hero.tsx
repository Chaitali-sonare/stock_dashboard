
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const Hero: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".hero-animate");
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      elements.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const scrollToStocks = () => {
    const stocksSection = document.getElementById("stocks-section");
    if (stocksSection) {
      stocksSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-900 to-gray-900 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
    
      <div className="container px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="flex flex-col items-center text-center opacity-0 hero-animate">
          <div className="mb-8">
            <span className="bg-blue-600 bg-opacity-30 text-blue-100 px-4 py-1 rounded-full text-sm font-medium">
            Stock Market Dashboard
            </span>
          </div>
          
          <h1 
            ref={titleRef} 
            className="text-4xl md:text-6xl font-extrabold text-white mb-6 relative overflow-hidden"
          >
            <span className="relative inline-block">
              Market Insights in <span className="text-blue-300">Real-Time</span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-10">
            Track, analyze, and visualize stock market data with our powerful dashboard. Get the information you need to make informed investment decisions.
          </p>
          
          <Button 
            onClick={scrollToStocks} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105"
          >
            Explore Stocks
            <ChevronDown className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
     
    </section>
  );
};

export default Hero;
