'use client';

import { createContext, useContext, useState } from 'react';
import { SortOptions } from '@/types/sort-options';

type FilterContextType = {
  sortBy: SortOptions | null;
  setSortBy: (value: SortOptions | null) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [sortBy, setSortBy] = useState<SortOptions | null>(null);

  return (
    <FilterContext.Provider value={{ sortBy, setSortBy }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
