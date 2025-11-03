import React from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({ 
  globalFilter, 
  setGlobalFilter, 
  className = "w-full sm:w-64",
  placeholder = "Search..."
}: SearchBarProps) {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className={`${className} pl-10 h-11 text-base focus:ring-2 focus:ring-ring focus:border-ring`}
        aria-label="Buscar productos"
        role="searchbox"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
