import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuickFilters = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Movies', icon: 'Film' },
    { id: 'action', label: 'Action', icon: 'Zap' },
    { id: 'comedy', label: 'Comedy', icon: 'Smile' },
    { id: 'drama', label: 'Drama', icon: 'Heart' },
    { id: 'horror', label: 'Horror', icon: 'Ghost' },
    { id: 'romance', label: 'Romance', icon: 'Heart' },
    { id: 'sci-fi', label: 'Sci-Fi', icon: 'Rocket' },
    { id: 'thriller', label: 'Thriller', icon: 'Eye' }
  ];

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    if (filterId === 'all') {
      navigate('/movie-browse');
    } else {
      navigate(`/movie-browse?genre=${filterId}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-foreground">
          Browse by Genre
        </h2>
        <Button
          variant="ghost"
          onClick={() => navigate('/movie-browse')}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          View All
          <Icon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-3">
        {filters?.map((filter) => (
          <Button
            key={filter?.id}
            variant={activeFilter === filter?.id ? "default" : "outline"}
            onClick={() => handleFilterClick(filter?.id)}
            className="flex flex-col items-center space-y-2 h-20 text-xs"
          >
            <Icon name={filter?.icon} size={20} />
            <span>{filter?.label}</span>
          </Button>
        ))}
      </div>
      {/* Mobile Horizontal Scroll */}
      <div className="md:hidden flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
        {filters?.map((filter) => (
          <Button
            key={filter?.id}
            variant={activeFilter === filter?.id ? "default" : "outline"}
            onClick={() => handleFilterClick(filter?.id)}
            className="flex items-center space-x-2 whitespace-nowrap flex-shrink-0"
          >
            <Icon name={filter?.icon} size={16} />
            <span className="text-sm">{filter?.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;