import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SimilarMovies = ({ similarMovies, onMovieClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const moviesPerPage = 4;
  const totalPages = Math.ceil(similarMovies?.length / moviesPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentMovies = () => {
    const start = currentIndex * moviesPerPage;
    return similarMovies?.slice(start, start + moviesPerPage);
  };

  if (!similarMovies || similarMovies?.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Similar Movies
              </h2>
              <p className="text-muted-foreground font-body">
                Recommended based on collaborative filtering
              </p>
            </div>
            
            {/* Navigation Controls */}
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevSlide}
                  disabled={currentIndex === 0}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="ChevronLeft" size={20} />
                </Button>
                <span className="text-sm text-muted-foreground font-body px-2">
                  {currentIndex + 1} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextSlide}
                  disabled={currentIndex === totalPages - 1}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </div>
            )}
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getCurrentMovies()?.map((movie) => (
              <div
                key={movie?.id}
                className="group cursor-pointer"
                onClick={() => onMovieClick(movie?.id)}
              >
                <div className="space-y-3">
                  {/* Movie Poster */}
                  <div className="relative overflow-hidden rounded-lg bg-muted/20">
                    <Image
                      src={movie?.posterImage}
                      alt={`${movie?.title} poster`}
                      className="w-full h-80 object-cover movie-card-hover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <Icon name="Play" size={32} color="white" />
                        <p className="text-white text-sm font-body">View Details</p>
                      </div>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                      <Icon name="Star" size={12} color="var(--color-accent)" />
                      <span className="text-white text-xs font-body">
                        {movie?.averageRating?.toFixed(1)}
                      </span>
                    </div>

                    {/* Confidence Indicator */}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-body ${
                      movie?.confidence >= 0.8 
                        ? 'bg-success/20 text-success border border-success/30' 
                        : movie?.confidence >= 0.6
                        ? 'bg-warning/20 text-warning border border-warning/30' :'bg-muted/20 text-muted-foreground border border-muted/30'
                    }`}>
                      {Math.round(movie?.confidence * 100)}% match
                    </div>
                  </div>

                  {/* Movie Info */}
                  <div className="space-y-2">
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {movie?.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="font-body">{movie?.releaseYear}</span>
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span className="font-body">{movie?.runtime}m</span>
                      </div>
                    </div>
                    
                    {/* Genres */}
                    <div className="flex flex-wrap gap-1">
                      {movie?.genres?.slice(0, 2)?.map((genre, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted/10 text-muted-foreground text-xs font-body rounded border border-border"
                        >
                          {genre}
                        </span>
                      ))}
                      {movie?.genres?.length > 2 && (
                        <span className="px-2 py-1 bg-muted/10 text-muted-foreground text-xs font-body rounded border border-border">
                          +{movie?.genres?.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2 pt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentIndex
                      ? 'bg-primary' :'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* View All Link */}
          <div className="text-center pt-4">
            <Link
              to="/movie-browse"
              className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-body font-semibold transition-colors duration-200"
            >
              <span>Explore More Movies</span>
              <Icon name="ArrowRight" size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarMovies;