import React from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SortControls = ({ sortBy, sortOrder, onSortChange, viewMode, onViewModeChange }) => {
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Rating' },
    { value: 'title', label: 'Title (A-Z)' },
    { value: 'year', label: 'Release Year' },
    { value: 'popularity', label: 'Popularity' }
  ];

  const handleSortByChange = (value) => {
    onSortChange(value, sortOrder);
  };

  const handleSortOrderToggle = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  const getSortOrderIcon = () => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' ? 'ArrowUpAZ' : 'ArrowDownZA';
    }
    return sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getSortOrderLabel = () => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' ? 'A to Z' : 'Z to A';
    }
    if (sortBy === 'year') {
      return sortOrder === 'asc' ? 'Oldest First' : 'Newest First';
    }
    if (sortBy === 'rating') {
      return sortOrder === 'asc' ? 'Lowest First' : 'Highest First';
    }
    return sortOrder === 'asc' ? 'Ascending' : 'Descending';
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card border border-border rounded-lg p-4">
      {/* Sort Controls */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex items-center space-x-2">
          <Icon name="ArrowUpDown" size={20} className="text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Sort by:</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={handleSortByChange}
            className="min-w-32"
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSortOrderToggle}
            className="flex items-center space-x-1"
            title={getSortOrderLabel()}
          >
            <Icon name={getSortOrderIcon()} size={16} />
            <span className="hidden sm:inline text-xs">
              {getSortOrderLabel()}
            </span>
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-foreground">View:</span>
        <div className="flex items-center bg-muted rounded-md p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="px-3 py-1"
          >
            <Icon name="Grid3X3" size={16} />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="px-3 py-1"
          >
            <Icon name="List" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SortControls;