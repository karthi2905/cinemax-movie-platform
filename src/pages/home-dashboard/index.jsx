import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import SearchSection from './components/SearchSection';
import QuickFilters from './components/QuickFilters';
import MovieCarousel from './components/MovieCarousel';
import { getTrendingMovies, getTopRatedMovies, getRandomMovies, getPersonalizedRecommendations } from '../../data/movieUtils';
import { allMovies } from '../../data/movies';
import AIRecommendationService from '../../utils/AIRecommendationService';

const HomeDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [aiRecommendedMovies, setAiRecommendedMovies] = useState([]);
  const [becauseYouWatchedMovies, setBecauseYouWatchedMovies] = useState([]);
  const [aiService] = useState(() => new AIRecommendationService());

  useEffect(() => {
    // Simulate loading time and fetch real data
    const timer = setTimeout(() => {
      // Get featured movies (top rated recent movies)
      const topRecent = allMovies
        .filter(movie => movie.releaseYear >= 2015 && movie.averageRating >= 8.0)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 3)
        .map(movie => ({
          id: movie.id,
          title: movie.title,
          backdrop: movie.backdropImage,
          poster: movie.posterImage,
          rating: movie.averageRating,
          year: movie.releaseYear,
          genre: movie.genres[0],
          duration: `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`,
          description: movie.synopsis
        }));
      
      // Get trending movies
      const trending = getTrendingMovies(6).map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.posterImage,
        rating: movie.averageRating,
        year: movie.releaseYear,
        genre: movie.genres[0],
        inWatchlist: Math.random() > 0.5, // Random for demo
        userRating: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
      }));
      
      // Get recommended movies (high rated diverse genres)
      const recommended = getPersonalizedRecommendations({ 
        favoriteGenres: ['Drama', 'Sci-Fi', 'Thriller'], 
        minRating: 7.5 
      }, 5).map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.posterImage,
        rating: movie.averageRating,
        year: movie.releaseYear,
        genre: movie.genres[0],
        inWatchlist: Math.random() > 0.5, // Random for demo
        userRating: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
      }));
      
      // Get AI-powered recommendations based on user ratings
      const aiRecommendations = aiService.getHomePageRecommendations(8).map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.posterImage || movie.poster,
        rating: movie.rating,
        year: movie.year,
        genre: movie.genre,
        recommendationReason: movie.recommendationReason,
        confidence: movie.confidence,
        inWatchlist: Math.random() > 0.5, // Random for demo
        userRating: 0 // Not rated yet since these are recommendations
      }));
      
      // Get "Because You Watched" movies (sci-fi movies since featured has sci-fi)
      const becauseYouWatched = allMovies
        .filter(movie => movie.genres.includes('Sci-Fi') && movie.averageRating >= 7.0)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, 4)
        .map(movie => ({
          id: movie.id,
          title: movie.title,
          poster: movie.posterImage,
          rating: movie.averageRating,
          year: movie.releaseYear,
          genre: movie.genres[0],
          inWatchlist: Math.random() > 0.5, // Random for demo
          userRating: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0
        }));
      
      setFeaturedMovies(topRecent);
      setTrendingMovies(trending);
      setRecommendedMovies(recommended);
      setAiRecommendedMovies(aiRecommendations);
      setBecauseYouWatchedMovies(becauseYouWatched);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-8">
          <div className="container mx-auto px-6 space-y-8">
            {/* Loading Hero */}
            <div className="h-96 md:h-[500px] bg-card rounded-lg shimmer" />
            
            {/* Loading Search */}
            <div className="space-y-4">
              <div className="h-12 bg-card rounded-md shimmer" />
              <div className="flex space-x-2">
                {Array.from({ length: 5 })?.map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-card rounded-md shimmer" />
                ))}
              </div>
            </div>

            {/* Loading Carousels */}
            {Array.from({ length: 3 })?.map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 w-48 bg-card rounded shimmer" />
                <div className="flex space-x-4">
                  {Array.from({ length: 6 })?.map((_, j) => (
                    <div key={j} className="w-40 h-60 bg-card rounded-lg shimmer flex-shrink-0" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="container mx-auto px-6 space-y-12">
          {/* Hero Section */}
          <HeroSection featuredMovies={featuredMovies} />

          {/* Search Section */}
          <SearchSection />

          {/* Quick Filters */}
          <QuickFilters />

          {/* Trending Now */}
          <MovieCarousel
            title="Trending Now"
            movies={trendingMovies}
            cardSize="default"
            showQuickActions={true}
          />

          {/* AI Powered Recommendations */}
          {aiRecommendedMovies.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground">
                    AI Recommendations for You
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Personalized suggestions based on your ratings and preferences
                  </p>
                </div>
              </div>
              <MovieCarousel
                movies={aiRecommendedMovies}
                cardSize="default"
                showQuickActions={true}
              />
            </div>
          )}

          {/* Recommended for You */}
          <MovieCarousel
            title="Recommended for You"
            movies={recommendedMovies}
            cardSize="default"
            showQuickActions={true}
          />

          {/* Because You Watched */}
          <MovieCarousel
            title={featuredMovies.length > 0 ? `Because You Watched ${featuredMovies[0].title}` : "Because You Watched"}
            movies={becauseYouWatchedMovies}
            cardSize="default"
            showQuickActions={true}
          />

          {/* Continue Watching */}
          <MovieCarousel
            title="Continue Watching"
            movies={trendingMovies?.slice(0, 4)}
            cardSize="large"
            showQuickActions={false}
          />
        </div>
      </main>
    </div>
  );
};

export default HomeDashboard;