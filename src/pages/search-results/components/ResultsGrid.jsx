import React from 'react';
import MovieCard from './MovieCard';
import Icon from '../../../components/AppIcon';

const ResultsGrid = ({ movies, viewMode, isLoading }) => {
  if (isLoading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
      }`}>
        {Array.from({ length: 8 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
            {viewMode === 'grid' ? (
              <>
                <div className="w-full h-64 sm:h-72 bg-muted shimmer" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-3 bg-muted rounded w-2/3 shimmer" />
                  <div className="h-3 bg-muted rounded w-1/2 shimmer" />
                </div>
              </>
            ) : (
              <div className="flex space-x-4 p-4">
                <div className="w-20 h-28 bg-muted rounded-md shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded shimmer" />
                  <div className="h-3 bg-muted rounded w-2/3 shimmer" />
                  <div className="h-3 bg-muted rounded w-1/2 shimmer" />
                  <div className="h-3 bg-muted rounded w-3/4 shimmer" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!movies || movies?.length === 0) {
    return (
      <div className="text-center py-16">
        <Icon name="Film" size={64} className="text-muted-foreground mx-auto mb-6" />
        <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
          No Movies Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any movies matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' ?'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
    }`}>
      {movies?.map((movie) => (
        <MovieCard
          key={movie?.id}
          movie={movie}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default ResultsGrid;