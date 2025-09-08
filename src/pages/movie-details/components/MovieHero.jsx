import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MovieHero = ({ movie, onWatchlistToggle, isInWatchlist }) => {
  return (
    <div className="relative bg-gradient-to-b from-background via-background/95 to-background">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={movie?.backdropImage}
          alt={`${movie?.title} backdrop`}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      {/* Content */}
      <div className="relative px-6 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Movie Poster */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative group">
                <Image
                  src={movie?.posterImage}
                  alt={`${movie?.title} poster`}
                  className="w-64 h-96 object-cover rounded-lg shadow-cinematic-intense"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
              </div>
            </div>

            {/* Movie Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title and Year */}
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-5xl font-heading font-bold text-foreground leading-tight">
                  {movie?.title}
                </h1>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <span className="text-lg font-body">{movie?.releaseYear}</span>
                  <span className="text-sm">•</span>
                  <span className="text-lg font-body">{movie?.runtime} min</span>
                  <span className="text-sm">•</span>
                  <span className="text-lg font-body">{movie?.certification}</span>
                </div>
              </div>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2">
                {movie?.genres?.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted/20 text-muted-foreground text-sm font-body rounded-full border border-border"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Rating Display */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Icon name="Star" size={24} color="var(--color-accent)" />
                  <span className="text-2xl font-heading font-bold text-foreground">
                    {movie?.averageRating?.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground font-body">
                    ({movie?.totalRatings?.toLocaleString()} ratings)
                  </span>
                </div>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center space-x-2">
                  <Icon name="TrendingUp" size={20} color="var(--color-success)" />
                  <span className="text-success font-body font-semibold">
                    {movie?.popularity}% Match
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="default"
                  size="lg"
                  iconName="Play"
                  iconPosition="left"
                  className="bg-primary hover:bg-primary/90"
                >
                  Watch Trailer
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName={isInWatchlist ? "Check" : "Plus"}
                  iconPosition="left"
                  onClick={onWatchlistToggle}
                >
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  iconName="Share"
                  iconPosition="left"
                >
                  Share
                </Button>
              </div>

              {/* Synopsis */}
              <div className="space-y-3">
                <h3 className="text-xl font-heading font-semibold text-foreground">
                  Synopsis
                </h3>
                <p className="text-muted-foreground font-body leading-relaxed text-base lg:text-lg">
                  {movie?.synopsis}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;