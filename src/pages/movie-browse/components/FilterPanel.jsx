import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const FilterPanel = ({ filters, onFiltersChange, onClearFilters, isExpanded, onToggleExpanded }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const genreOptions = [
    { value: '', label: 'All Genres' },
    { value: 'Action', label: 'Action' },
    { value: 'Adventure', label: 'Adventure' },
    { value: 'Animation', label: 'Animation' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Crime', label: 'Crime' },
    { value: 'Documentary', label: 'Documentary' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Family', label: 'Family' },
    { value: 'Fantasy', label: 'Fantasy' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Mystery', label: 'Mystery' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Sci-Fi', label: 'Science Fiction' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'War', label: 'War' },
    { value: 'Western', label: 'Western' },
    { value: 'Biography', label: 'Biography' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating_desc', label: 'Rating (High to Low)' },
    { value: 'rating_asc', label: 'Rating (Low to High)' },
    { value: 'release_date_desc', label: 'Release Date (Newest)' },
    { value: 'release_date_asc', label: 'Release Date (Oldest)' },
    { value: 'popularity_desc', label: 'Popularity (High to Low)' },
    { value: 'title_asc', label: 'Title (A-Z)' },
    { value: 'title_desc', label: 'Title (Z-A)' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9+', label: '9.0+ Excellent' },
    { value: '8+', label: '8.0+ Very Good' },
    { value: '7+', label: '7.0+ Good' },
    { value: '6+', label: '6.0+ Fair' },
    { value: '5+', label: '5.0+ Average' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      genre: '',
      rating: '',
      yearFrom: '',
      yearTo: '',
      sortBy: 'relevance'
    };
    setLocalFilters(clearedFilters);
    onClearFilters(clearedFilters);
  };

  const hasActiveFilters = localFilters?.genre || localFilters?.rating || localFilters?.yearFrom || localFilters?.yearTo;

  return (
    <div className="bg-card border border-border rounded-lg shadow-cinematic">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <Button
          variant="ghost"
          onClick={onToggleExpanded}
          className="flex items-center space-x-2"
        >
          <Icon name="Filter" size={20} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleExpanded}
        >
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4`}>
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Genre Filter */}
          <div className="flex-1 min-w-0">
            <Select
              label="Genre"
              options={genreOptions}
              value={localFilters?.genre}
              onChange={(value) => handleFilterChange('genre', value)}
              placeholder="Select genre"
            />
          </div>

          {/* Rating Filter */}
          <div className="flex-1 min-w-0">
            <Select
              label="Minimum Rating"
              options={ratingOptions}
              value={localFilters?.rating}
              onChange={(value) => handleFilterChange('rating', value)}
              placeholder="Any rating"
            />
          </div>

          {/* Year Range */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 gap-2">
              <Input
                label="From Year"
                type="number"
                placeholder="1990"
                value={localFilters?.yearFrom}
                onChange={(e) => handleFilterChange('yearFrom', e?.target?.value)}
                min="1900"
                max="2024"
              />
              <Input
                label="To Year"
                type="number"
                placeholder="2024"
                value={localFilters?.yearTo}
                onChange={(e) => handleFilterChange('yearTo', e?.target?.value)}
                min="1900"
                max="2024"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex-1 min-w-0">
            <Select
              label="Sort By"
              options={sortOptions}
              value={localFilters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>

          {/* Clear Filters */}
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={!hasActiveFilters}
              className="w-full md:w-auto"
            >
              <Icon name="X" size={16} className="mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {localFilters?.genre && (
                <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  {genreOptions?.find(g => g?.value === localFilters?.genre)?.label}
                  <button
                    onClick={() => handleFilterChange('genre', '')}
                    className="ml-1 hover:text-primary/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {localFilters?.rating && (
                <span className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                  {ratingOptions?.find(r => r?.value === localFilters?.rating)?.label}
                  <button
                    onClick={() => handleFilterChange('rating', '')}
                    className="ml-1 hover:text-accent/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
              {(localFilters?.yearFrom || localFilters?.yearTo) && (
                <span className="inline-flex items-center px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                  {localFilters?.yearFrom || '1900'} - {localFilters?.yearTo || '2024'}
                  <button
                    onClick={() => {
                      handleFilterChange('yearFrom', '');
                      handleFilterChange('yearTo', '');
                    }}
                    className="ml-1 hover:text-success/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;