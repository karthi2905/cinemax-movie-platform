import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MovieCard = ({ movie, onRate, onToggleWatchlist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(movie?.userRating || 0);

  const handleRatingSubmit = () => {
    onRate(movie?.id, selectedRating);
    setShowRatingModal(false);
  };

  const handleWatchlistToggle = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onToggleWatchlist(movie?.id);
  };

  const handleRatingClick = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowRatingModal(true);
  };

  const formatRating = (rating) => {
    return rating ? rating?.toFixed(1) : 'N/A';
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'text-success';
    if (rating >= 6) return 'text-accent';
    if (rating >= 4) return 'text-warning';
    return 'text-error';
  };

  return (
    <>
      <div
        className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-cinematic hover:shadow-cinematic-intense transition-all duration-200 ease-cinematic movie-card-hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/movie-details/${movie?.id}`} className="block">
          {/* Movie Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={movie?.poster}
              alt={movie?.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Overlay on Hover */}
            <div className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'} md:flex items-center justify-center hidden`}>
              <div className="text-center space-y-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRatingClick}
                  className="w-full"
                >
                  <Icon name="Star" size={16} className="mr-2" />
                  Rate Movie
                </Button>
                <Button
                  variant={movie?.inWatchlist ? "default" : "outline"}
                  size="sm"
                  onClick={handleWatchlistToggle}
                  className="w-full"
                >
                  <Icon name={movie?.inWatchlist ? "Check" : "Plus"} size={16} className="mr-2" />
                  {movie?.inWatchlist ? 'In Watchlist' : 'Add to List'}
                </Button>
              </div>
            </div>

            {/* Rating Badge */}
            <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-xs font-semibold">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-accent" />
                <span className={getRatingColor(movie?.rating)}>{formatRating(movie?.rating)}</span>
              </div>
            </div>

            {/* Watchlist Indicator */}
            {movie?.inWatchlist && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground p-1 rounded-full">
                <Icon name="Bookmark" size={12} />
              </div>
            )}
          </div>

          {/* Movie Info */}
          <div className="p-4">
            <h3 className="font-heading font-semibold text-card-foreground text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {movie?.title}
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{movie?.year}</span>
                <span className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{movie?.duration} min</span>
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {movie?.genres?.slice(0, 2)?.map((genre, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted/20 text-muted-foreground text-xs rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                {movie?.genres?.length > 2 && (
                  <span className="px-2 py-1 bg-muted/20 text-muted-foreground text-xs rounded-full">
                    +{movie?.genres?.length - 2}
                  </span>
                )}
              </div>

              {/* User Rating */}
              {movie?.userRating && (
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-muted-foreground">Your rating:</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-accent fill-current" />
                    <span className="text-accent font-semibold">{movie?.userRating}/10</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>

        {/* Mobile Action Buttons */}
        <div className="md:hidden p-4 pt-0 flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRatingClick}
            className="flex-1"
          >
            <Icon name="Star" size={16} className="mr-2" />
            Rate
          </Button>
          <Button
            variant={movie?.inWatchlist ? "default" : "outline"}
            size="sm"
            onClick={handleWatchlistToggle}
            className="flex-1"
          >
            <Icon name={movie?.inWatchlist ? "Check" : "Plus"} size={16} className="mr-2" />
            {movie?.inWatchlist ? 'Added' : 'List'}
          </Button>
        </div>
      </div>
      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-lg font-heading font-semibold text-card-foreground mb-2">
                Rate "{movie?.title}"
              </h3>
              <p className="text-sm text-muted-foreground">
                How would you rate this movie?
              </p>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                    selectedRating >= rating
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'border-border text-muted-foreground hover:border-accent/50'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0}
                className="flex-1"
              >
                Submit Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieCard;