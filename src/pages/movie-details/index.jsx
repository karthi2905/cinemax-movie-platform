import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MovieHero from './components/MovieHero';
import MovieInfo from './components/MovieInfo';
import RatingComponent from './components/RatingComponent';
import SimilarMovies from './components/SimilarMovies';
import { getMovieById, getSimilarMovies } from '../../data/movieUtils';
import AIRecommendationService from '../../utils/AIRecommendationService';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const movieId = id;
  
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiService] = useState(() => new AIRecommendationService());


  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get movie data from the real movies database
      const movieData = getMovieById(movieId);
      
      if (!movieData) {
        // If movie not found, redirect to 404 or home
        setLoading(false);
        return;
      }
      
      setMovie(movieData);
      
      // Get similar movies
      const similarMoviesData = getSimilarMovies(movieId, 6);
      setSimilarMovies(similarMoviesData);
      
      // Load user's rating from localStorage
      const savedRating = localStorage.getItem(`rating_${movieId}`);
      if (savedRating) {
        setUserRating(parseInt(savedRating));
      }
      
      // Load watchlist status from localStorage
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setIsInWatchlist(watchlist?.includes(movieId));
      
      setLoading(false);
    };

    if (movieId) {
      loadMovieData();
    }
  }, [movieId]);

  const handleRatingSubmit = async (rating) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (rating === 0) {
      localStorage.removeItem(`rating_${movieId}`);
      setUserRating(0);
    } else {
      localStorage.setItem(`rating_${movieId}`, rating?.toString());
      setUserRating(rating);
    }
    
    // Update movie's average rating (mock calculation)
    if (movie) {
      const newTotalRatings = rating === 0 ? movie?.totalRatings - 1 : movie?.totalRatings + 1;
      const newAverageRating = rating === 0 
        ? movie?.averageRating 
        : ((movie?.averageRating * movie?.totalRatings) + rating) / newTotalRatings;
      
      setMovie(prev => ({
        ...prev,
        averageRating: Math.max(0, newAverageRating),
        totalRatings: Math.max(0, newTotalRatings)
      }));
    }
    
    // Update AI recommendation system
    aiService.updateUserRating(movieId, rating);
    
    // Show a subtle notification that recommendations are being updated
    if (rating > 0) {
      // You could show a toast notification here
      console.log('Your movie recommendations are being updated based on this rating!');
    }
  };

  const handleWatchlistToggle = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    let updatedWatchlist;
    
    if (isInWatchlist) {
      updatedWatchlist = watchlist?.filter(id => id !== movieId);
    } else {
      updatedWatchlist = [...watchlist, movieId];
    }
    
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    setIsInWatchlist(!isInWatchlist);
  };

  const handleSimilarMovieClick = (id) => {
    navigate(`/movie-details/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground font-body">Loading movie details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-0">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <p className="text-xl font-heading font-semibold text-foreground">Movie not found</p>
              <p className="text-muted-foreground font-body">The requested movie could not be loaded.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 md:pb-0">
        {/* Movie Hero Section */}
        <MovieHero 
          movie={movie}
          onWatchlistToggle={handleWatchlistToggle}
          isInWatchlist={isInWatchlist}
        />
        
        {/* Movie Information */}
        <MovieInfo movie={movie} />
        
        {/* Rating Component */}
        <RatingComponent 
          movie={movie}
          userRating={userRating}
          onRatingSubmit={handleRatingSubmit}
        />
        
        {/* Similar Movies */}
        <SimilarMovies 
          similarMovies={similarMovies}
          onMovieClick={handleSimilarMovieClick}
        />
      </main>
    </div>
  );
};

export default MovieDetails;