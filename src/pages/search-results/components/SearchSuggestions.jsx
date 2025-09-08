import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchSuggestions = ({ query, onSuggestionClick, onClearSearch }) => {
  const suggestions = [
    "action movies 2024",
    "best comedy films",
    "sci-fi thriller",
    "romantic drama",
    "superhero movies",
    "horror classics",
    "animated family films",
    "documentary series",
    "mystery thriller",
    "adventure movies"
  ];

  const popularSearches = [
    "Marvel movies",
    "Christopher Nolan",
    "Studio Ghibli",
    "Best of 2023",
    "Oscar winners",
    "Netflix originals",
    "Cult classics",
    "Foreign films"
  ];

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.toLowerCase()?.includes(query?.toLowerCase())
  )?.slice(0, 5);

  if (!query || query?.length < 2) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 shadow-cinematic">
        <div className="text-center">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Start Your Search
          </h3>
          <p className="text-muted-foreground mb-6">
            Enter a movie title, genre, or actor to find what you're looking for
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Popular Searches</h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches?.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onSuggestionClick(search)}
                    className="text-xs"
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-cinematic">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Search Suggestions
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSearch}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="X" size={16} className="mr-1" />
          Clear
        </Button>
      </div>
      {filteredSuggestions?.length > 0 ? (
        <div className="space-y-2">
          {filteredSuggestions?.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full justify-start text-left p-3 h-auto"
            >
              <Icon name="Search" size={16} className="mr-3 text-muted-foreground" />
              <span className="text-foreground">{suggestion}</span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-heading font-semibold text-foreground mb-2">
            No Suggestions Found
          </h4>
          <p className="text-muted-foreground mb-4">
            Try searching for a different term or browse our popular categories
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearches?.slice(0, 4)?.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(search)}
                className="text-xs"
              >
                {search}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;