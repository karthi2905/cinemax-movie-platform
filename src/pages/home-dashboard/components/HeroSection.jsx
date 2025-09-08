import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = ({ featuredMovies }) => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % featuredMovies?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies?.length]);

  const movie = featuredMovies?.[currentMovie];

  const handleWatchlistToggle = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  const goToSlide = (index) => {
    setCurrentMovie(index);
  };

  return (
    <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg bg-card">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={movie?.backdrop}
          alt={movie?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl space-y-6">
            {/* Movie Title */}
            <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
              {movie?.title}
            </h1>

            {/* Movie Info */}
            <div className="flex items-center space-x-4 text-white/90">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={16} className="text-accent fill-current" />
                <span className="text-sm font-semibold">{movie?.rating}</span>
              </div>
              <span className="text-sm">{movie?.year}</span>
              <span className="text-sm px-2 py-1 bg-white/20 rounded">
                {movie?.genre}
              </span>
              <span className="text-sm">{movie?.duration}</span>
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm md:text-base leading-relaxed line-clamp-3">
              {movie?.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Link to={`/movie-details/${movie?.id}`}>
                <Button variant="default" className="bg-primary hover:bg-primary/90">
                  <Icon name="Play" size={16} className="mr-2" />
                  Watch Now
                </Button>
              </Link>
              
              <Button
                variant="outline"
                onClick={handleWatchlistToggle}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Icon 
                  name={isInWatchlist ? "Check" : "Plus"} 
                  size={16} 
                  className="mr-2" 
                />
                {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
              </Button>

              <Link to={`/movie-details/${movie?.id}`}>
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  <Icon name="Info" size={16} className="mr-2" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-6 flex space-x-2">
        {featuredMovies?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentMovie 
                ? 'bg-white w-8' :'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToSlide(currentMovie === 0 ? featuredMovies?.length - 1 : currentMovie - 1)}
          className="bg-black/30 hover:bg-black/50 text-white"
        >
          <Icon name="ChevronLeft" size={24} />
        </Button>
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => goToSlide((currentMovie + 1) % featuredMovies?.length)}
          className="bg-black/30 hover:bg-black/50 text-white"
        >
          <Icon name="ChevronRight" size={24} />
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;