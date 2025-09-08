import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MovieCard = ({ movie, viewMode = 'grid' }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(movie?.isInWatchlist || false);
  const [userRating, setUserRating] = useState(movie?.userRating || 0);
  const [isRatingHovered, setIsRatingHovered] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleWatchlistToggle = (e) => {
    e?.preventDefault();
    setIsInWatchlist(!isInWatchlist);
  };

  const handleRating = (rating, e) => {
    e?.preventDefault();
    setUserRating(rating);
  };

  const renderStars = () => {
    const stars = [];
    const displayRating = isRatingHovered ? hoveredRating : userRating;
    
    for (let i = 1; i <= 5; i++) {
      stars?.push(
        <button
          key={i}
          onClick={(e) => handleRating(i, e)}
          onMouseEnter={() => {
            setIsRatingHovered(true);
            setHoveredRating(i);
          }}
          onMouseLeave={() => {
            setIsRatingHovered(false);
            setHoveredRating(0);
          }}
          className="text-accent hover:text-accent transition-colors duration-200"
        >
          <Icon 
            name={i <= displayRating ? "Star" : "Star"} 
            size={16} 
            className={i <= displayRating ? "fill-current" : ""}
          />
        </button>
      );
    }
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/movie-details/${movie?.id}`}
        className="block bg-card border border-border rounded-lg p-4 hover:shadow-cinematic transition-all duration-200 ease-cinematic"
      >
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <Image
              src={movie?.poster}
              alt={movie?.title}
              className="w-20 h-28 object-cover rounded-md"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground truncate">
                  {movie?.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {movie?.year} • {movie?.genre} • {movie?.duration}
                </p>
                
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={16} className="text-accent fill-current" />
                    <span className="text-sm font-medium text-foreground">
                      {movie?.rating}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Icon name="Users" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {movie?.votes} votes
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {movie?.description}
                </p>
              </div>
              
              <div className="flex flex-col items-end space-y-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWatchlistToggle}
                  className={isInWatchlist ? "text-primary" : "text-muted-foreground"}
                >
                  <Icon name={isInWatchlist ? "BookmarkCheck" : "Bookmark"} size={16} />
                </Button>
                
                <div className="flex space-x-1">
                  {renderStars()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/movie-details/${movie?.id}`}
      className="group block bg-card border border-border rounded-lg overflow-hidden movie-card-hover shadow-cinematic"
    >
      <div className="relative">
        <Image
          src={movie?.poster}
          alt={movie?.title}
          className="w-full h-64 sm:h-72 object-cover"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleWatchlistToggle}
              className={isInWatchlist ? "bg-primary text-primary-foreground" : ""}
            >
              <Icon name={isInWatchlist ? "BookmarkCheck" : "Bookmark"} size={16} />
            </Button>
            
            <Button variant="secondary" size="sm">
              <Icon name="Play" size={16} />
            </Button>
          </div>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-sm font-medium">
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={12} className="text-accent fill-current" />
            <span>{movie?.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-heading font-semibold text-foreground truncate mb-1">
          {movie?.title}
        </h3>
        
        <p className="text-sm text-muted-foreground mb-2">
          {movie?.year} • {movie?.genre}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Icon name="Users" size={14} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {movie?.votes} votes
            </span>
          </div>
          
          <div className="flex space-x-1">
            {renderStars()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;