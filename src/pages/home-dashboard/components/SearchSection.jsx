import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/search-results?q=${encodeURIComponent(searchQuery?.trim())}`);
    }
  };

  const popularSearches = [
    "Marvel Movies",
    "Christopher Nolan",
    "Action 2024",
    "Comedy Classics",
    "Horror Movies"
  ];

  const handlePopularSearch = (query) => {
    navigate(`/search-results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1 relative">
            <Input
              type="search"
              placeholder="Search for movies, actors, directors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-12 pr-4"
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            />
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
          </div>
          <Button type="submit" variant="default">
            <Icon name="Search" size={16} className="md:mr-2" />
            <span className="hidden md:inline">Search</span>
          </Button>
        </form>

        {/* Search Suggestions Dropdown */}
        {isExpanded && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-md shadow-cinematic z-50">
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Suggestions
              </div>
              {popularSearches?.filter(search => search?.toLowerCase()?.includes(searchQuery?.toLowerCase()))?.slice(0, 5)?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handlePopularSearch(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm text-popover-foreground hover:bg-muted/10 rounded-md transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Icon name="Search" size={14} className="text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
      {/* Popular Searches */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading font-semibold text-foreground">
          Popular Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularSearches?.map((search, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handlePopularSearch(search)}
              className="text-xs"
            >
              <Icon name="TrendingUp" size={12} className="mr-1" />
              {search}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;