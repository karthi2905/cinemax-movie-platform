// Movie Data Utilities for CineMax
// Helper functions for managing, filtering, and searching movie data

import { allMovies, genreCollections, popularCollections } from './movies.js';

// Get movie by ID
export const getMovieById = (id) => {
  return allMovies.find(movie => movie.id === id?.toString());
};

// Get movies by genre
export const getMoviesByGenre = (genre) => {
  if (!genre) return allMovies;
  return allMovies.filter(movie => 
    movie.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
  );
};

// Get movies by year range
export const getMoviesByYearRange = (startYear, endYear) => {
  return allMovies.filter(movie => 
    movie.releaseYear >= startYear && movie.releaseYear <= endYear
  );
};

// Get movies by rating range
export const getMoviesByRating = (minRating, maxRating = 10) => {
  return allMovies.filter(movie => 
    movie.averageRating >= minRating && movie.averageRating <= maxRating
  );
};

// Search movies by title, director, cast, or synopsis
export const searchMovies = (query, filters = {}) => {
  if (!query || query.trim() === '') {
    return filterMovies(allMovies, filters);
  }

  const searchTerm = query.toLowerCase().trim();
  let results = allMovies.filter(movie => {
    // Search in title
    if (movie.title.toLowerCase().includes(searchTerm)) return true;
    
    // Search in director name
    if (movie.director.name.toLowerCase().includes(searchTerm)) return true;
    
    // Search in cast names
    if (movie.cast.some(actor => 
      actor.name.toLowerCase().includes(searchTerm) || 
      actor.character.toLowerCase().includes(searchTerm)
    )) return true;
    
    // Search in synopsis
    if (movie.synopsis.toLowerCase().includes(searchTerm)) return true;
    
    // Search in genres
    if (movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))) return true;
    
    return false;
  });

  // Apply additional filters
  return filterMovies(results, filters);
};

// Apply multiple filters to movie list
export const filterMovies = (movies, filters) => {
  let filteredMovies = [...movies];

  // Filter by genres
  if (filters.genres && filters.genres.length > 0) {
    filteredMovies = filteredMovies.filter(movie =>
      filters.genres.some(genre => movie.genres.includes(genre))
    );
  }

  // Filter by year range
  if (filters.yearFrom || filters.yearTo) {
    const yearFrom = filters.yearFrom || 1900;
    const yearTo = filters.yearTo || new Date().getFullYear();
    filteredMovies = filteredMovies.filter(movie =>
      movie.releaseYear >= yearFrom && movie.releaseYear <= yearTo
    );
  }

  // Filter by rating range
  if (filters.ratingFrom || filters.ratingTo) {
    const ratingFrom = filters.ratingFrom || 0;
    const ratingTo = filters.ratingTo || 10;
    filteredMovies = filteredMovies.filter(movie =>
      movie.averageRating >= ratingFrom && movie.averageRating <= ratingTo
    );
  }

  // Filter by certification
  if (filters.certification) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.certification === filters.certification
    );
  }

  // Filter by language
  if (filters.language) {
    filteredMovies = filteredMovies.filter(movie =>
      movie.language.toLowerCase() === filters.language.toLowerCase()
    );
  }

  return filteredMovies;
};

// Sort movies by different criteria
export const sortMovies = (movies, sortBy = 'popularity', sortOrder = 'desc') => {
  const sortedMovies = [...movies];
  
  sortedMovies.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'title':
        valueA = a.title.toLowerCase();
        valueB = b.title.toLowerCase();
        break;
      case 'year':
        valueA = a.releaseYear;
        valueB = b.releaseYear;
        break;
      case 'rating':
        valueA = a.averageRating;
        valueB = b.averageRating;
        break;
      case 'popularity':
        valueA = a.popularity;
        valueB = b.popularity;
        break;
      case 'runtime':
        valueA = a.runtime;
        valueB = b.runtime;
        break;
      default:
        valueA = a.popularity;
        valueB = b.popularity;
    }

    if (sortOrder === 'asc') {
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    } else {
      if (valueA > valueB) return -1;
      if (valueA < valueB) return 1;
      return 0;
    }
  });

  return sortedMovies;
};

// Get paginated results
export const getPaginatedMovies = (movies, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedMovies = movies.slice(startIndex, endIndex);
  
  return {
    movies: paginatedMovies,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(movies.length / limit),
      totalResults: movies.length,
      hasNextPage: endIndex < movies.length,
      hasPreviousPage: page > 1,
      limit
    }
  };
};

// Get similar movies based on genres and ratings
export const getSimilarMovies = (movieId, limit = 6) => {
  const targetMovie = getMovieById(movieId);
  if (!targetMovie) return [];

  const similarMovies = allMovies
    .filter(movie => movie.id !== movieId)
    .map(movie => {
      let score = 0;
      
      // Genre similarity (most important factor)
      const sharedGenres = movie.genres.filter(genre => 
        targetMovie.genres.includes(genre)
      );
      score += sharedGenres.length * 3;
      
      // Rating similarity
      const ratingDiff = Math.abs(movie.averageRating - targetMovie.averageRating);
      score += Math.max(0, 2 - ratingDiff);
      
      // Year proximity
      const yearDiff = Math.abs(movie.releaseYear - targetMovie.releaseYear);
      if (yearDiff <= 5) score += 1;
      else if (yearDiff <= 10) score += 0.5;
      
      // Director match
      if (movie.director.name === targetMovie.director.name) score += 2;
      
      return { ...movie, similarityScore: score };
    })
    .filter(movie => movie.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, limit);

  return similarMovies;
};

// Get trending movies (high popularity, recent, good ratings)
export const getTrendingMovies = (limit = 20) => {
  const currentYear = new Date().getFullYear();
  
  return allMovies
    .filter(movie => {
      // Recent movies with good ratings and high popularity
      return movie.averageRating >= 7.0 && 
             movie.popularity >= 80 && 
             movie.releaseYear >= currentYear - 5;
    })
    .sort((a, b) => {
      // Weighted score: popularity (40%) + rating (30%) + recency (30%)
      const scoreA = (a.popularity * 0.4) + (a.averageRating * 10 * 0.3) + 
                     ((a.releaseYear - (currentYear - 5)) / 5 * 100 * 0.3);
      const scoreB = (b.popularity * 0.4) + (b.averageRating * 10 * 0.3) + 
                     ((b.releaseYear - (currentYear - 5)) / 5 * 100 * 0.3);
      return scoreB - scoreA;
    })
    .slice(0, limit);
};

// Get top rated movies of all time
export const getTopRatedMovies = (limit = 20) => {
  return allMovies
    .filter(movie => movie.totalRatings >= 100000) // Minimum rating threshold
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit);
};

// Get movies by decade
export const getMoviesByDecade = (decade) => {
  const startYear = decade;
  const endYear = decade + 9;
  return getMoviesByYearRange(startYear, endYear);
};

// Get random movies
export const getRandomMovies = (count = 10, filters = {}) => {
  let moviePool = allMovies;
  
  // Apply filters if provided
  if (Object.keys(filters).length > 0) {
    moviePool = filterMovies(allMovies, filters);
  }
  
  const shuffled = [...moviePool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Get movie statistics
export const getMovieStats = () => {
  const totalMovies = allMovies.length;
  const avgRating = allMovies.reduce((sum, movie) => sum + movie.averageRating, 0) / totalMovies;
  const genres = [...new Set(allMovies.flatMap(movie => movie.genres))];
  const years = allMovies.map(movie => movie.releaseYear);
  const oldestYear = Math.min(...years);
  const newestYear = Math.max(...years);
  
  const genreStats = genres.map(genre => ({
    genre,
    count: allMovies.filter(movie => movie.genres.includes(genre)).length
  })).sort((a, b) => b.count - a.count);

  return {
    totalMovies,
    averageRating: Math.round(avgRating * 10) / 10,
    totalGenres: genres.length,
    yearRange: `${oldestYear} - ${newestYear}`,
    topGenres: genreStats.slice(0, 5),
    allGenres: genreStats
  };
};

// Get personalized recommendations (placeholder for future ML implementation)
export const getPersonalizedRecommendations = (userPreferences, limit = 10) => {
  // This is a simple implementation - in a real app, this would use ML algorithms
  let recommendations = allMovies;
  
  // Filter by preferred genres if provided
  if (userPreferences.favoriteGenres && userPreferences.favoriteGenres.length > 0) {
    recommendations = recommendations.filter(movie =>
      movie.genres.some(genre => userPreferences.favoriteGenres.includes(genre))
    );
  }
  
  // Filter by rating preference
  if (userPreferences.minRating) {
    recommendations = recommendations.filter(movie =>
      movie.averageRating >= userPreferences.minRating
    );
  }
  
  // Exclude movies user has already seen (if provided)
  if (userPreferences.watchedMovies && userPreferences.watchedMovies.length > 0) {
    recommendations = recommendations.filter(movie =>
      !userPreferences.watchedMovies.includes(movie.id)
    );
  }
  
  // Sort by popularity and rating combined
  recommendations = recommendations.sort((a, b) => {
    const scoreA = (a.popularity * 0.6) + (a.averageRating * 10 * 0.4);
    const scoreB = (b.popularity * 0.6) + (b.averageRating * 10 * 0.4);
    return scoreB - scoreA;
  });
  
  return recommendations.slice(0, limit);
};

// Get all movies (alias for allMovies for consistency)
export const getAllMovies = () => allMovies;

// Export all collections and utilities
export {
  allMovies,
  genreCollections,
  popularCollections
};

export default {
  getMovieById,
  getMoviesByGenre,
  getMoviesByYearRange,
  getMoviesByRating,
  searchMovies,
  filterMovies,
  sortMovies,
  getPaginatedMovies,
  getSimilarMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getMoviesByDecade,
  getRandomMovies,
  getMovieStats,
  getPersonalizedRecommendations,
  allMovies,
  genreCollections,
  popularCollections
};
