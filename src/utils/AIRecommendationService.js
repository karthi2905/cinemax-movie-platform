import { getAllMovies } from '../data/movieUtils';

class AIRecommendationService {
  constructor() {
    this.userProfile = this.loadUserProfile();
    this.movies = getAllMovies();
  }

  loadUserProfile() {
    // Load user data from localStorage
    const ratings = this.loadUserRatings();
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const watchHistory = this.getWatchHistory();
    
    return {
      ratings,
      watchlist,
      watchHistory,
      preferences: this.calculatePreferences(ratings)
    };
  }

  loadUserRatings() {
    const ratings = {};
    // Get all ratings from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('rating_')) {
        const movieId = key.replace('rating_', '');
        const rating = parseInt(localStorage.getItem(key));
        ratings[movieId] = rating;
      }
    }
    return ratings;
  }

  getWatchHistory() {
    // For now, we'll consider rated movies as watched
    // In a real app, this would track actual viewing history
    return Object.keys(this.loadUserRatings());
  }

  calculatePreferences(ratings) {
    if (!ratings || Object.keys(ratings).length === 0) {
      return { genres: {}, keywords: {}, actors: {}, directors: {} };
    }

    const preferences = {
      genres: {},
      keywords: {},
      actors: {},
      directors: {},
      averageRating: 0,
      totalRatings: 0
    };

    let totalRating = 0;
    let ratingCount = 0;

    // Analyze user's rated movies
    Object.entries(ratings).forEach(([movieId, rating]) => {
      const movie = this.movies.find(m => m.id === movieId);
      if (!movie) return;

      totalRating += rating;
      ratingCount++;

      // Weight by user's rating (higher rated movies have more influence)
      const weight = rating / 5; // Normalize to 0-1

      // Genre preferences
      if (movie.genre) {
        movie.genre.split(',').forEach(genre => {
          genre = genre.trim();
          preferences.genres[genre] = (preferences.genres[genre] || 0) + weight;
        });
      }

      // Extract keywords from description
      if (movie.synopsis) {
        const keywords = this.extractKeywords(movie.synopsis);
        keywords.forEach(keyword => {
          preferences.keywords[keyword] = (preferences.keywords[keyword] || 0) + weight;
        });
      }

      // Director preferences
      if (movie.director) {
        preferences.directors[movie.director] = (preferences.directors[movie.director] || 0) + weight;
      }

      // Actor preferences (if available)
      if (movie.cast) {
        movie.cast.split(',').forEach(actor => {
          actor = actor.trim();
          preferences.actors[actor] = (preferences.actors[actor] || 0) + weight;
        });
      }
    });

    preferences.averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
    preferences.totalRatings = ratingCount;

    return preferences;
  }

  extractKeywords(text) {
    // Simple keyword extraction - in production you'd use more sophisticated NLP
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'his', 'her', 'their', 'its', 'this', 'that', 'these', 'those'];
    
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 10); // Take top 10 keywords
  }

  getPersonalizedRecommendations(limit = 10) {
    if (Object.keys(this.userProfile.ratings).length === 0) {
      // New user - return popular movies
      return this.movies
        .filter(movie => movie.rating > 7.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit)
        .map(movie => ({
          ...movie,
          recommendationReason: 'Popular and highly rated',
          confidence: 0.7
        }));
    }

    const { preferences } = this.userProfile;
    const watchedIds = new Set(this.userProfile.watchHistory);
    
    // Score each unwatched movie
    const scoredMovies = this.movies
      .filter(movie => !watchedIds.has(movie.id))
      .map(movie => {
        const score = this.calculateMovieScore(movie, preferences);
        const reason = this.generateRecommendationReason(movie, preferences);
        
        return {
          ...movie,
          score,
          recommendationReason: reason,
          confidence: Math.min(score / 10, 1) // Normalize confidence
        };
      })
      .filter(movie => movie.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scoredMovies;
  }

  calculateMovieScore(movie, preferences) {
    let score = 0;

    // Genre matching
    if (movie.genre) {
      const movieGenres = movie.genre.split(',').map(g => g.trim());
      movieGenres.forEach(genre => {
        if (preferences.genres[genre]) {
          score += preferences.genres[genre] * 3; // Genre is important
        }
      });
    }

    // Keyword matching
    if (movie.synopsis) {
      const movieKeywords = this.extractKeywords(movie.synopsis);
      movieKeywords.forEach(keyword => {
        if (preferences.keywords[keyword]) {
          score += preferences.keywords[keyword] * 1.5;
        }
      });
    }

    // Director matching
    if (movie.director && preferences.directors[movie.director]) {
      score += preferences.directors[movie.director] * 2;
    }

    // Rating bias (prefer higher-rated movies)
    if (movie.rating) {
      score += (movie.rating / 10) * 2;
    }

    // Year bias (slight preference for newer movies)
    const currentYear = new Date().getFullYear();
    const movieYear = parseInt(movie.year || currentYear);
    const yearDiff = currentYear - movieYear;
    const yearScore = Math.max(0, (20 - yearDiff) / 20); // Movies older than 20 years get 0 boost
    score += yearScore * 0.5;

    return score;
  }

  generateRecommendationReason(movie, preferences) {
    const reasons = [];

    // Check genre match
    if (movie.genre) {
      const movieGenres = movie.genre.split(',').map(g => g.trim());
      const topGenre = Object.entries(preferences.genres)
        .sort((a, b) => b[1] - a[1])[0];
      
      if (topGenre && movieGenres.includes(topGenre[0])) {
        reasons.push(`You enjoy ${topGenre[0]} movies`);
      }
    }

    // Check director match
    if (movie.director && preferences.directors[movie.director]) {
      reasons.push(`You like movies by ${movie.director}`);
    }

    // Check rating
    if (movie.rating >= 8.0) {
      reasons.push('Highly rated by critics and audiences');
    }

    // Default reason
    if (reasons.length === 0) {
      reasons.push('Based on your viewing preferences');
    }

    return reasons.slice(0, 2).join(' • ');
  }

  getMoviesBasedOnQuery(query, limit = 10) {
    const lowerQuery = query.toLowerCase();
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 2);

    return this.movies
      .map(movie => {
        let relevanceScore = 0;

        // Title matching
        if (movie.title.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 10;
        }

        // Genre matching
        if (movie.genre && queryWords.some(word => movie.genre.toLowerCase().includes(word))) {
          relevanceScore += 8;
        }

        // Synopsis matching
        if (movie.synopsis) {
          const synopsisLower = movie.synopsis.toLowerCase();
          queryWords.forEach(word => {
            if (synopsisLower.includes(word)) {
              relevanceScore += 3;
            }
          });
        }

        // Director matching
        if (movie.director && movie.director.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 7;
        }

        // Cast matching
        if (movie.cast && movie.cast.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 5;
        }

        return {
          ...movie,
          relevanceScore,
          recommendationReason: this.generateQueryReason(movie, query, relevanceScore)
        };
      })
      .filter(movie => movie.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
  }

  generateQueryReason(movie, query, score) {
    const reasons = [];
    const lowerQuery = query.toLowerCase();

    if (movie.title.toLowerCase().includes(lowerQuery)) {
      reasons.push('Title match');
    }
    
    if (movie.genre && movie.genre.toLowerCase().includes(lowerQuery)) {
      reasons.push('Genre match');
    }
    
    if (movie.director && movie.director.toLowerCase().includes(lowerQuery)) {
      reasons.push('Director match');
    }
    
    if (score >= 15) {
      reasons.push('Strong relevance');
    } else if (score >= 10) {
      reasons.push('Good match');
    } else {
      reasons.push('Relevant content');
    }

    return reasons.slice(0, 2).join(' • ');
  }

  updateUserRating(movieId, rating) {
    // This gets called when user rates a movie
    this.userProfile = this.loadUserProfile(); // Refresh profile
    
    // Optionally trigger background recommendation refresh
    this.refreshRecommendations();
  }

  refreshRecommendations() {
    // Could trigger a background update of homepage recommendations
    // For now, we'll just update the cache
    const newRecommendations = this.getPersonalizedRecommendations(20);
    localStorage.setItem('ai_recommendations', JSON.stringify({
      recommendations: newRecommendations,
      timestamp: Date.now(),
      version: this.userProfile.totalRatings // Use rating count as version
    }));
  }

  getCachedRecommendations() {
    const cached = localStorage.getItem('ai_recommendations');
    if (!cached) return null;

    const data = JSON.parse(cached);
    const isStale = Date.now() - data.timestamp > 24 * 60 * 60 * 1000; // 24 hours
    const versionChanged = data.version !== this.userProfile.totalRatings;

    if (isStale || versionChanged) {
      return null; // Cache is stale
    }

    return data.recommendations;
  }

  getHomePageRecommendations(limit = 8) {
    // Try to get cached recommendations first
    const cached = this.getCachedRecommendations();
    if (cached) {
      return cached.slice(0, limit);
    }

    // Generate fresh recommendations
    const recommendations = this.getPersonalizedRecommendations(limit);
    this.refreshRecommendations(); // Cache them
    return recommendations;
  }

  // Enhanced conversational AI processing
  processConversationalQuery(query) {
    const lowerQuery = query.toLowerCase();
    let recommendations = [];
    let responseText = '';

    // Pattern matching for different types of queries
    if (lowerQuery.includes('watched') && (lowerQuery.includes('loved') || lowerQuery.includes('liked'))) {
      // "I watched X and loved it" pattern
      const movieMentions = this.extractMovieNames(query);
      if (movieMentions.length > 0) {
        recommendations = this.getSimilarToMovie(movieMentions[0]);
        responseText = `Great choice! Since you loved ${movieMentions[0]}, here are some movies with similar themes and style:`;
      }
    } else if (lowerQuery.includes('time travel') || lowerQuery.includes('time machine')) {
      recommendations = this.getMoviesByTheme('time travel');
      responseText = 'Time travel movies are fascinating! Here are some excellent films that explore temporal concepts:';
    } else if (lowerQuery.includes('dark') && lowerQuery.includes('psychological')) {
      recommendations = this.getMoviesByTheme('psychological thriller');
      responseText = 'Perfect! Here are some brilliantly crafted dark psychological films:';
    } else if (lowerQuery.includes('nolan') || lowerQuery.includes('christopher nolan')) {
      recommendations = this.getMoviesByDirectorStyle('Christopher Nolan');
      responseText = 'Christopher Nolan has a unique style! Here are movies with similar complex narratives:';
    } else {
      // General query
      recommendations = this.getMoviesBasedOnQuery(query);
      responseText = `Based on your request "${query}", here are some great movie recommendations:`;
    }

    return {
      text: responseText,
      movies: recommendations.slice(0, 6) // Limit to 6 for chat interface
    };
  }

  extractMovieNames(text) {
    // Simple movie name extraction - match against known movie titles
    const movieNames = [];
    const words = text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/);
    
    this.movies.forEach(movie => {
      const movieTitle = movie.title.toLowerCase();
      if (text.toLowerCase().includes(movieTitle)) {
        movieNames.push(movie.title);
      }
    });
    
    return movieNames;
  }

  getSimilarToMovie(movieTitle) {
    const targetMovie = this.movies.find(m => 
      m.title.toLowerCase() === movieTitle.toLowerCase()
    );
    
    if (!targetMovie) return [];

    // Find similar movies based on genre and other attributes
    return this.movies
      .filter(movie => movie.id !== targetMovie.id)
      .map(movie => {
        let similarity = 0;
        
        // Genre similarity
        if (movie.genre && targetMovie.genre) {
          const movieGenres = movie.genre.split(',').map(g => g.trim());
          const targetGenres = targetMovie.genre.split(',').map(g => g.trim());
          const commonGenres = movieGenres.filter(g => targetGenres.includes(g));
          similarity += commonGenres.length * 3;
        }
        
        // Rating similarity
        if (movie.rating && targetMovie.rating) {
          const ratingDiff = Math.abs(movie.rating - targetMovie.rating);
          similarity += Math.max(0, 3 - ratingDiff);
        }
        
        return { ...movie, similarity };
      })
      .filter(movie => movie.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);
  }

  getMoviesByTheme(theme) {
    return this.movies
      .filter(movie => {
        const searchText = `${movie.title} ${movie.synopsis} ${movie.genre}`.toLowerCase();
        return searchText.includes(theme.toLowerCase());
      })
      .sort((a, b) => b.rating - a.rating);
  }

  getMoviesByDirectorStyle(director) {
    // For demo, return movies with similar themes to the director's style
    const styleKeywords = {
      'Christopher Nolan': ['complex', 'mind', 'reality', 'time', 'dream', 'psychological', 'twist']
    };
    
    const keywords = styleKeywords[director] || [];
    
    return this.movies
      .filter(movie => {
        const searchText = `${movie.synopsis} ${movie.genre}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      })
      .sort((a, b) => b.rating - a.rating);
  }
}

export default AIRecommendationService;
