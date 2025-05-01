
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "@/hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search stocks...",
}) => {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search to avoid excessive re-renders
  const debouncedSearch = useDebouncedCallback((query: string) => {
    onSearch(query);
  }, 300);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  // Focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex w-full items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-10 py-5 w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        <Button
          type="submit"
          variant="ghost"
          className="absolute right-0 top-0 h-full px-3"
        >
          <span className="sr-only">Search</span>
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
