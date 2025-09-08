import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit, placeholder = "Search movies..." }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock search suggestions
  const mockSuggestions = [
    "The Dark Knight",
    "Inception",
    "Pulp Fiction",
    "The Shawshank Redemption",
    "Fight Club",
    "Forrest Gump",
    "The Matrix",
    "Goodfellas",
    "The Godfather",
    "Interstellar",
    "Avengers: Endgame",
    "Parasite",
    "Joker",
    "Spider-Man",
    "Batman",
    "Marvel",
    "DC Comics",
    "Action Movies",
    "Comedy Movies",
    "Horror Movies"
  ];

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setLocalQuery(value);
    onSearchChange(value);

    // Generate suggestions
    if (value?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion => 
          suggestion?.toLowerCase()?.includes(value?.toLowerCase())
        )?.slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearchSubmit(localQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setLocalQuery(suggestion);
    onSearchChange(suggestion);
    onSearchSubmit(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (localQuery?.length > 0 && suggestions?.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Input
            type="search"
            placeholder={placeholder}
            value={localQuery}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pr-20"
          />
          
          {/* Clear Button */}
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name="X" size={16} />
            </button>
          )}
          
          {/* Search Button */}
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="Search" size={20} />
          </Button>
        </div>
      </form>
      {/* Search Suggestions */}
      {showSuggestions && suggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-cinematic z-50">
          <div className="py-2">
            {suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted/10 transition-colors duration-200 flex items-center space-x-2"
              >
                <Icon name="Search" size={14} className="text-muted-foreground" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;