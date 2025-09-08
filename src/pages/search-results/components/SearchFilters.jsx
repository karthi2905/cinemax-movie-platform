import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SearchFilters = ({ filters, onFiltersChange, onClearFilters, isExpanded, onToggleExpanded }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const genreOptions = [
    { value: '', label: 'All Genres' },
    { value: 'action', label: 'Action' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'animation', label: 'Animation' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'crime', label: 'Crime' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'drama', label: 'Drama' },
    { value: 'family', label: 'Family' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'horror', label: 'Horror' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'romance', label: 'Romance' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'thriller', label: 'Thriller' },
    { value: 'war', label: 'War' },
    { value: 'western', label: 'Western' }
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '9+', label: '9.0+ Excellent' },
    { value: '8+', label: '8.0+ Very Good' },
    { value: '7+', label: '7.0+ Good' },
    { value: '6+', label: '6.0+ Average' },
    { value: '5+', label: '5.0+ Below Average' }
  ];

  const yearOptions = [
    { value: '', label: 'Any Year' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2010s', label: '2010-2019' },
    { value: '2000s', label: '2000-2009' },
    { value: '1990s', label: '1990-1999' },
    { value: 'older', label: 'Before 1990' }
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
      year: '',
      minRating: '',
      maxRating: ''
    };
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg shadow-cinematic">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          onClick={onToggleExpanded}
          className="w-full justify-between p-4 text-left"
        >
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} />
            <span className="font-semibold">Filters</span>
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
        </Button>
      </div>
      {/* Filter Content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} md:block p-4 md:p-6`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Filter Results
          </h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} className="mr-1" />
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Genre Filter */}
          <Select
            label="Genre"
            options={genreOptions}
            value={localFilters?.genre}
            onChange={(value) => handleFilterChange('genre', value)}
            placeholder="Select genre"
          />

          {/* Rating Filter */}
          <Select
            label="Minimum Rating"
            options={ratingOptions}
            value={localFilters?.rating}
            onChange={(value) => handleFilterChange('rating', value)}
            placeholder="Select rating"
          />

          {/* Year Filter */}
          <Select
            label="Release Year"
            options={yearOptions}
            value={localFilters?.year}
            onChange={(value) => handleFilterChange('year', value)}
            placeholder="Select year"
          />

          {/* Custom Rating Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Custom Rating Range
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters?.minRating}
                onChange={(e) => handleFilterChange('minRating', e?.target?.value)}
                min="0"
                max="10"
                step="0.1"
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Max"
                value={localFilters?.maxRating}
                onChange={(e) => handleFilterChange('maxRating', e?.target?.value)}
                min="0"
                max="10"
                step="0.1"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;