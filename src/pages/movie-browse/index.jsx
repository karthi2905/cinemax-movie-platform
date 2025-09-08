import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { searchMovies, filterMovies, sortMovies } from '../../data/movieUtils';
import { allMovies } from '../../data/movies';

const MovieBrowse = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    yearFrom: '',
    yearTo: '',
    sortBy: 'relevance'
  });
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  // Convert our movie data to the expected format for the UI
  const formatMovieForUI = (movie) => ({
    id: parseInt(movie.id),
    title: movie.title,
    poster: movie.posterImage,
    rating: movie.averageRating,
    year: movie.releaseYear,
    duration: movie.runtime,
    genres: movie.genres,
    userRating: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0, // Random for demo
    inWatchlist: Math.random() > 0.6 // Random for demo
  });

  useEffect(() => {
    // Simulate API call and use real movie data
    setLoading(true);
    setTimeout(() => {
      // Start with all movies
      let filtered = [...allMovies];
      
      // Apply search query first if present
      if (searchQuery?.trim()) {
        const searchTerm = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(movie => {
          return movie.title.toLowerCase().includes(searchTerm) ||
                 movie.director.name.toLowerCase().includes(searchTerm) ||
                 movie.cast.some(actor => 
                   actor.name.toLowerCase().includes(searchTerm) || 
                   actor.character.toLowerCase().includes(searchTerm)
                 ) ||
                 movie.synopsis.toLowerCase().includes(searchTerm) ||
                 movie.genres.some(genre => genre.toLowerCase().includes(searchTerm));
        });
      }
      
      // Apply genre filter
      if (filters.genre && filters.genre.trim()) {
        filtered = filtered.filter(movie => 
          movie.genres.includes(filters.genre)
        );
      }
      
      // Apply rating filter
      if (filters.rating && filters.rating.trim()) {
        const minRating = parseFloat(filters.rating.replace('+', ''));
        if (!isNaN(minRating)) {
          filtered = filtered.filter(movie => movie.averageRating >= minRating);
        }
      }
      
      // Apply year filters
      if (filters.yearFrom && !isNaN(parseInt(filters.yearFrom))) {
        filtered = filtered.filter(movie => movie.releaseYear >= parseInt(filters.yearFrom));
      }
      
      if (filters.yearTo && !isNaN(parseInt(filters.yearTo))) {
        filtered = filtered.filter(movie => movie.releaseYear <= parseInt(filters.yearTo));
      }
      
      // Debug logging
      console.log('Applied filters:', filters);
      console.log('Filtered results count:', filtered.length);
      console.log('Sample filtered movie:', filtered[0]);
      
      // Apply sorting
      const sortBy = filters.sortBy === 'relevance' ? 'popularity' : filters.sortBy;
      const sortOrder = sortBy.includes('_asc') ? 'asc' : 'desc';
      const sortField = sortBy.replace('_desc', '').replace('_asc', '').replace('release_date', 'year').replace('popularity', 'popularity');
      
      filtered = sortMovies(filtered, sortField, sortOrder);
      
      // Convert to UI format
      const formattedMovies = filtered.map(formatMovieForUI);
      
      setMovies(formattedMovies);
      setResultCount(formattedMovies?.length);
      setLoading(false);
    }, 800);
  }, [filters, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = (clearedFilters) => {
    setFilters(clearedFilters);
    setSearchQuery('');
  };

  const handleRate = (movieId, rating) => {
    setMovies(prevMovies =>
      prevMovies?.map(movie =>
        movie?.id === movieId ? { ...movie, userRating: rating } : movie
      )
    );
  };

  const handleToggleWatchlist = (movieId) => {
    setMovies(prevMovies =>
      prevMovies?.map(movie =>
        movie?.id === movieId ? { ...movie, inWatchlist: !movie?.inWatchlist } : movie
      )
    );
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Browse Movies
            </h1>
            <p className="text-muted-foreground">
              Discover your next favorite movie with our advanced filtering and search capabilities
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search for movies, genres, actors..."
            />
          </div>

          {/* Filter Panel */}
          <div className="mb-8">
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              isExpanded={isFilterExpanded}
              onToggleExpanded={() => setIsFilterExpanded(!isFilterExpanded)}
            />
          </div>

          {/* Movie Grid */}
          <MovieGrid
            movies={movies}
            loading={loading}
            onRate={handleRate}
            onToggleWatchlist={handleToggleWatchlist}
            resultCount={resultCount}
          />

          {/* Scroll to Top Button */}
          <Button
            variant="secondary"
            size="icon"
            onClick={handleScrollToTop}
            className="fixed bottom-24 md:bottom-8 right-4 z-40 shadow-cinematic"
          >
            <Icon name="ArrowUp" size={20} />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MovieBrowse;