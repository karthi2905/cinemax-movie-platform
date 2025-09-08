import React from 'react';
import MovieCard from './MovieCard';
import Icon from '../../../components/AppIcon';

const MovieGrid = ({ movies, loading, onRate, onToggleWatchlist, resultCount }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-muted/20 rounded w-32 shimmer"></div>
          <div className="h-4 bg-muted/20 rounded w-24 shimmer"></div>
        </div>
        {/* Loading Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 })?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="aspect-[2/3] bg-muted/20 shimmer"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted/20 rounded shimmer"></div>
                <div className="h-3 bg-muted/20 rounded w-3/4 shimmer"></div>
                <div className="flex space-x-2">
                  <div className="h-5 bg-muted/20 rounded-full w-12 shimmer"></div>
                  <div className="h-5 bg-muted/20 rounded-full w-16 shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies || movies?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-full mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
          No movies found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          We couldn't find any movies matching your current filters. Try adjusting your search criteria or clearing some filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading font-semibold text-card-foreground">
          Browse Movies
        </h2>
        <div className="text-sm text-muted-foreground">
          {resultCount?.toLocaleString()} movies found
        </div>
      </div>
      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies?.map((movie) => (
          <MovieCard
            key={movie?.id}
            movie={movie}
            onRate={onRate}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
      {/* Load More Indicator */}
      {movies?.length > 0 && movies?.length % 24 === 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <Icon name="MoreHorizontal" size={20} />
            <span className="text-sm">Scroll down to load more movies</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieGrid;