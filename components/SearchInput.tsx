'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  onSearchChange: (query: string) => void;
  initialQuery?: string;
  delay?: number;
}

export default function SearchInput({
  onSearchChange,
  initialQuery = '',
  delay = 500,
}: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    onSearchChange(debouncedQuery);
  }, [debouncedQuery, onSearchChange]);

  return (
    <div className="w-full">
      <div className="relative group">
        <svg
          aria-hidden="true"
          className="absolute w-5 h-5 text-gray-400 left-4 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for markets..."
          className="w-full pl-11 pr-4 py-3 text-base text-gray-900 bg-white border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}
