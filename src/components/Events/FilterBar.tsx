
import React, { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventCategory } from "@/types";
import { categoryOptions } from "@/services/mockData";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  onFilterChange: (filters: {
    searchTerm?: string;
    category?: EventCategory;
  }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<EventCategory | undefined>(undefined);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ searchTerm: value, category });
  };

  // Handle category filter change
  const handleCategoryChange = (value: EventCategory) => {
    setCategory(value);
    onFilterChange({ searchTerm, category: value });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setCategory(undefined);
    onFilterChange({ searchTerm: "", category: undefined });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
      {/* Search input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
          className="pl-9 w-full"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            onClick={() => {
              setSearchTerm("");
              onFilterChange({ searchTerm: "", category });
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filters section */}
      <div className="flex items-center gap-2">
        {/* Reset button - only shown if filters are active */}
        {(searchTerm || category) && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}

        {/* Filter button and popover */}
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {category && (
                <span className="bg-primary/20 text-primary text-xs py-0.5 px-1.5 rounded-full">
                  1
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h3 className="font-medium">Filters</h3>
              
              {/* Category filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={category}
                  onValueChange={(value: EventCategory) => handleCategoryChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: option.color }}
                          ></div>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action buttons */}
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
                <Button size="sm" onClick={() => setFiltersOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default FilterBar;
