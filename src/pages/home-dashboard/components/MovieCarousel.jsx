import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MovieCarousel = ({ title, movies, cardSize = 'default', showQuickActions = true }) => {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef?.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef?.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef?.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef?.current?.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      
      setTimeout(checkScrollButtons, 300);
    }
  };

  React.useEffect(() => {
    checkScrollButtons();
    const handleResize = () => checkScrollButtons();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [movies]);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-foreground">
          {title}
        </h2>
        
        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <Icon name="ChevronLeft" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>
      {/* Movies Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkScrollButtons}
        >
          {movies?.map((movie) => (
            <MovieCard
              key={movie?.id}
              movie={movie}
              size={cardSize}
              showQuickActions={showQuickActions}
            />
          ))}
        </div>

        {/* Mobile Scroll Indicators */}
        <div className="md:hidden flex justify-center mt-2 space-x-1">
          {Array.from({ length: Math.ceil(movies?.length / 3) })?.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-muted-foreground/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCarousel;