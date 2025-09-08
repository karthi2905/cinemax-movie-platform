import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MovieCard = ({ movie, size = 'default', showQuickActions = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(movie?.inWatchlist || false);
  const [userRating, setUserRating] = useState(movie?.userRating || 0);

  const handleWatchlistToggle = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsInWatchlist(!isInWatchlist);
  };

  const handleRating = (rating, e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setUserRating(rating);
  };

  const cardSizes = {
    small: 'w-32 h-48',
    default: 'w-40 h-60',
    large: 'w-48 h-72'
  };

  const imageSizes = {
    small: 'h-36',
    default: 'h-44',
    large: 'h-52'
  };

  return (
    <Link
      to={`/movie-details/${movie?.id}`}
      className={`${cardSizes?.[size]} flex-shrink-0 group cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full bg-card rounded-lg overflow-hidden shadow-cinematic transition-all duration-300 ease-cinematic group-hover:shadow-cinematic-intense group-hover:scale-105">
        {/* Movie Poster */}
        <div className={`relative ${imageSizes?.[size]} overflow-hidden`}>
          <Image
            src={movie?.poster}
            alt={movie?.title}
            className="w-full h-full object-cover"
          />
          
          {/* Hover Overlay */}
          {isHovered && showQuickActions && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWatchlistToggle}
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <Icon 
                    name={isInWatchlist ? "Check" : "Plus"} 
                    size={16} 
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 hover:bg-black/70 text-white"
                >
                  <Icon name="Play" size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center space-x-1">
            <Icon name="Star" size={12} className="text-accent fill-current" />
            <span>{movie?.rating}</span>
          </div>

          {/* Watchlist Indicator */}
          {isInWatchlist && (
            <div className="absolute top-2 left-2 bg-primary text-white p-1 rounded-full">
              <Icon name="Check" size={12} />
            </div>
          )}
        </div>

        {/* Movie Info */}
        <div className="p-3 space-y-2">
          <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-2 leading-tight">
            {movie?.title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{movie?.year}</span>
            <span className="px-2 py-1 bg-muted/20 rounded text-xs">
              {movie?.genre}
            </span>
          </div>

          {/* User Rating */}
          {showQuickActions && (
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5]?.map((star) => (
                <button
                  key={star}
                  onClick={(e) => handleRating(star, e)}
                  className="text-muted-foreground hover:text-accent transition-colors duration-200"
                >
                  <Icon
                    name="Star"
                    size={12}
                    className={star <= userRating ? "text-accent fill-current" : ""}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;