/**
 * Comprehensive Recommendation Service
 * Integrates recommendation engine, sentiment analysis, and evaluation metrics
 */

import RecommendationEngine from './recommendationEngine.js';
import SentimentAnalyzer from './sentimentAnalysis.js';
import EvaluationMetrics from './evaluationMetrics.js';
import { allMovies } from '../data/movies.js';

class RecommendationService {
  constructor() {
    this.engine = new RecommendationEngine();
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.evaluationMetrics = new EvaluationMetrics();
    this.isInitialized = false;
    this.userProfiles = new Map();
    this.movieReviews = new Map();
    this.userInteractions = new Map();
  }

  /**
   * Initialize the recommendation service
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Recommendation Service...');
      
      // Load movie data
      await this.loadMovieData();
      
      // Initialize with sample user data
      this.initializeSampleData();
      
      // Process existing reviews for sentiment analysis
      await this.processExistingReviews();
      
      this.isInitialized = true;
      console.log('✅ Recommendation Service initialized successfully');
      
      return {
        status: 'success',
        message: 'Recommendation service initialized',
        stats: {
          totalMovies: allMovies.length,
          totalUsers: this.engine.userRatings.size,
          totalReviews: this.getTotalReviews()
        }
      };
    } catch (error) {
      console.error('❌ Failed to initialize recommendation service:', error);
      throw error;
    }
  }

  /**
   * Get personalized recommendations for a user
   */
  async getPersonalizedRecommendations(userId, options = {}) {
    const {
      count = 10,
      includeExplanation = true,
      includeSentiment = true,
      filterAdultContent = true,
      minRating = 7.0,
      preferredGenres = [],
      avoidGenres = []
    } = options;

    try {
      // Filter movies based on preferences
      let candidates = allMovies.filter(movie => {
        // Filter adult content
        if (filterAdultContent && this.isAdultContent(movie)) return false;
        
        // Minimum rating filter
        if (movie.averageRating < minRating) return false;
        
        // Genre preferences
        if (preferredGenres.length > 0) {
          const hasPreferredGenre = preferredGenres.some(genre => 
            movie.genres.includes(genre)
          );
          if (!hasPreferredGenre) return false;
        }
        
        // Avoid certain genres
        if (avoidGenres.length > 0) {
          const hasAvoidedGenre = avoidGenres.some(genre => 
            movie.genres.includes(genre)
          );
          if (hasAvoidedGenre) return false;
        }
        
        return true;
      });

      // Handle cold-start problem for new users
      if (!this.engine.userRatings.has(userId)) {
        return await this.handleColdStartUser(userId, candidates, options);
      }

      // Get hybrid recommendations
      const recommendations = await this.engine.getHybridRecommendations(
        userId, 
        candidates, 
        {
          count: count * 2, // Get more to allow for filtering
          minRating: minRating
        }
      );

      // Add sentiment analysis if requested
      if (includeSentiment) {
        for (const rec of recommendations) {
          const movieReviews = this.movieReviews.get(rec.movie.id) || [];
          const sentimentAnalysis = this.sentimentAnalyzer.calculateMovieSentiment(movieReviews);
          rec.sentimentAnalysis = sentimentAnalysis;
        }
      }

      // Add explanations if requested
      if (includeExplanation) {
        for (const rec of recommendations) {
          rec.explanation = this.generateExplanation(userId, rec);
        }
      }

      // Sort by combined score and return top N
      const finalRecommendations = recommendations
        .slice(0, count)
        .map(rec => ({
          movie: {
            id: rec.movie.id,
            title: rec.movie.title,
            releaseYear: rec.movie.releaseYear,
            genres: rec.movie.genres,
            averageRating: rec.movie.averageRating,
            posterImage: rec.movie.posterImage,
            backdropImage: rec.movie.backdropImage,
            synopsis: rec.movie.synopsis,
            director: rec.movie.director,
            runtime: rec.movie.runtime
          },
          score: rec.score,
          confidence: this.calculateConfidence(rec),
          reasons: rec.explanation || [],
          sentimentScore: rec.sentimentAnalysis?.averageSentiment || 0,
          predictionDetails: {
            collaborativeScore: rec.cfScore,
            contentScore: rec.contentScore,
            hybridScore: rec.score
          }
        }));

      return {
        status: 'success',
        recommendations: finalRecommendations,
        metadata: {
          userId: userId,
          totalCandidates: candidates.length,
          algorithmUsed: 'hybrid',
          generatedAt: new Date(),
          filters: {
            filterAdultContent,
            minRating,
            preferredGenres,
            avoidGenres
          }
        }
      };

    } catch (error) {
      console.error('Error generating recommendations:', error);
      return {
        status: 'error',
        message: error.message,
        recommendations: []
      };
    }
  }

  /**
   * Handle cold-start problem for new users
   */
  async handleColdStartUser(userId, candidates, options) {
    const { count = 10, preferredGenres = [] } = options;
    
    console.log(`🆕 Handling cold-start for user ${userId}`);
    
    // Strategy 1: Popular movies in preferred genres
    let recommendations = [];
    
    if (preferredGenres.length > 0) {
      recommendations = candidates
        .filter(movie => movie.genres.some(genre => preferredGenres.includes(genre)))
        .sort((a, b) => {
          // Sort by combination of rating and popularity
          const scoreA = (a.averageRating * 0.7) + (a.popularity * 0.3 / 100);
          const scoreB = (b.averageRating * 0.7) + (b.popularity * 0.3 / 100);
          return scoreB - scoreA;
        })
        .slice(0, count);
    } else {
      // Strategy 2: Overall popular movies
      recommendations = candidates
        .sort((a, b) => {
          const scoreA = (a.averageRating * 0.6) + (a.popularity * 0.4 / 100);
          const scoreB = (b.averageRating * 0.6) + (b.popularity * 0.4 / 100);
          return scoreB - scoreA;
        })
        .slice(0, count);
    }

    return {
      status: 'success',
      recommendations: recommendations.map(movie => ({
        movie: movie,
        score: 0.8, // Cold-start confidence
        confidence: 0.6,
        reasons: ['Popular movie', 'Highly rated', 'New user recommendation'],
        sentimentScore: 0,
        predictionDetails: {
          collaborativeScore: null,
          contentScore: movie.averageRating / 10,
          hybridScore: 0.8
        }
      })),
      metadata: {
        userId: userId,
        algorithmUsed: 'cold-start-popular',
        totalCandidates: candidates.length,
        generatedAt: new Date(),
        isNewUser: true
      }
    };
  }

  /**
   * Add user rating and update recommendations
   */
  async addUserRating(userId, movieId, rating, review = null) {
    try {
      // Add rating to recommendation engine
      this.engine.addUserRating(userId, movieId, rating);
      
      // Process review if provided
      if (review) {
        await this.addUserReview(userId, movieId, review, rating);
      }
      
      // Track interaction
      this.trackUserInteraction(userId, 'rating', { movieId, rating });
      
      // Update user profile
      this.updateUserProfile(userId, movieId, rating);
      
      return {
        status: 'success',
        message: 'Rating added successfully',
        userId: userId,
        movieId: movieId,
        rating: rating
      };
    } catch (error) {
      console.error('Error adding user rating:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Add user review with sentiment analysis
   */
  async addUserReview(userId, movieId, reviewText, rating = null) {
    try {
      // Analyze sentiment
      const sentiment = this.sentimentAnalyzer.analyzeSentiment(reviewText);
      
      // Store review
      if (!this.movieReviews.has(movieId)) {
        this.movieReviews.set(movieId, []);
      }
      
      const review = {
        id: `review_${Date.now()}_${Math.random()}`,
        userId: userId,
        movieId: movieId,
        text: reviewText,
        rating: rating,
        sentiment: sentiment,
        createdAt: new Date()
      };
      
      this.movieReviews.get(movieId).push(review);
      
      // Track interaction
      this.trackUserInteraction(userId, 'review', { movieId, sentiment: sentiment.sentiment });
      
      return {
        status: 'success',
        message: 'Review added successfully',
        review: review,
        sentiment: sentiment
      };
    } catch (error) {
      console.error('Error adding user review:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Get similar movies using cosine similarity
   */
  getSimilarMovies(movieId, count = 10) {
    try {
      const targetMovie = allMovies.find(m => m.id === movieId);
      if (!targetMovie) {
        throw new Error('Movie not found');
      }

      const similarities = allMovies
        .filter(movie => movie.id !== movieId)
        .map(movie => ({
          movie: movie,
          similarity: this.engine.contentBasedSimilarity(targetMovie, movie)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, count);

      return {
        status: 'success',
        targetMovie: {
          id: targetMovie.id,
          title: targetMovie.title,
          genres: targetMovie.genres
        },
        similarMovies: similarities.map(item => ({
          movie: {
            id: item.movie.id,
            title: item.movie.title,
            releaseYear: item.movie.releaseYear,
            genres: item.movie.genres,
            averageRating: item.movie.averageRating,
            posterImage: item.movie.posterImage,
            backdropImage: item.movie.backdropImage
          },
          similarityScore: item.similarity,
          confidence: Math.min(item.similarity, 1)
        }))
      };
    } catch (error) {
      console.error('Error finding similar movies:', error);
      return {
        status: 'error',
        message: error.message,
        similarMovies: []
      };
    }
  }

  /**
   * Get movie sentiment analysis
   */
  getMovieSentimentAnalysis(movieId) {
    try {
      const reviews = this.movieReviews.get(movieId) || [];
      const sentimentAnalysis = this.sentimentAnalyzer.calculateMovieSentiment(reviews);
      const insights = this.sentimentAnalyzer.generateInsights(sentimentAnalysis);

      return {
        status: 'success',
        movieId: movieId,
        sentiment: sentimentAnalysis,
        insights: insights,
        reviewCount: reviews.length
      };
    } catch (error) {
      console.error('Error analyzing movie sentiment:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Evaluate recommendation system performance
   */
  async evaluateSystem(testData = null) {
    try {
      if (!testData) {
        testData = this.generateTestData();
      }

      const results = this.evaluationMetrics.evaluateRecommendationSystem(
        testData,
        this.engine,
        {
          k: 10,
          thresholds: [7.0, 7.5, 8.0],
          calculateDiversity: true,
          calculateNovelty: true
        }
      );

      return {
        status: 'success',
        evaluation: results,
        testDataSize: testData.users?.length || 0,
        evaluatedAt: new Date()
      };
    } catch (error) {
      console.error('Error evaluating system:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * Get user statistics and insights
   */
  getUserInsights(userId) {
    try {
      const userRatings = this.engine.userRatings.get(userId) || {};
      const userProfile = this.userProfiles.get(userId) || {};
      const interactions = this.userInteractions.get(userId) || [];

      // Calculate user statistics
      const ratings = Object.values(userRatings);
      const avgRating = ratings.length > 0 ? 
        ratings.reduce((sum, r) => sum + r, 0) / ratings.length : 0;

      // Genre preferences
      const genreCount = {};
      const ratedMovies = Object.keys(userRatings).map(id => 
        allMovies.find(m => m.id === id)
      ).filter(Boolean);

      ratedMovies.forEach(movie => {
        movie.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });
      });

      const favoriteGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([genre, count]) => ({ genre, count }));

      return {
        status: 'success',
        userId: userId,
        statistics: {
          totalRatings: ratings.length,
          averageRating: avgRating,
          ratingDistribution: this.calculateRatingDistribution(ratings),
          favoriteGenres: favoriteGenres,
          totalInteractions: interactions.length,
          lastActive: interactions.length > 0 ? 
            Math.max(...interactions.map(i => i.timestamp)) : null
        },
        preferences: userProfile,
        insights: this.generateUserInsights(userId, userRatings, favoriteGenres)
      };
    } catch (error) {
      console.error('Error getting user insights:', error);
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  /**
   * UTILITY METHODS
   */
  
  loadMovieData() {
    console.log(`📚 Loading ${allMovies.length} movies...`);
    // Movies are already loaded from the import
    // Additional processing could be done here
  }

  initializeSampleData() {
    // Initialize with sample user ratings for testing
    this.engine.initializeWithSampleData();
    
    // Add sample reviews
    this.addSampleReviews();
  }

  addSampleReviews() {
    const sampleReviews = [
      {
        userId: 'user1',
        movieId: '1',
        text: 'Amazing movie! Absolutely loved the storyline and acting. Highly recommended!',
        rating: 9
      },
      {
        userId: 'user2',
        movieId: '1',
        text: 'Pretty good movie, enjoyed it overall but had some slow parts.',
        rating: 7
      },
      {
        userId: 'user3',
        movieId: '2',
        text: 'Terrible movie, waste of time. Poor acting and boring plot.',
        rating: 3
      }
    ];

    sampleReviews.forEach(review => {
      this.addUserReview(review.userId, review.movieId, review.text, review.rating);
    });
  }

  async processExistingReviews() {
    // Process any existing reviews for sentiment analysis
    // This would typically load from a database
    console.log('🔍 Processing existing reviews for sentiment analysis...');
  }

  isAdultContent(movie) {
    const adultIndicators = [
      'adult', 'erotic', 'porn', 'xxx', 'mature',
      'affairs', 'extramarital', 'sexual'
    ];
    
    const content = `${movie.title} ${movie.synopsis || ''} ${movie.genres.join(' ')}`.toLowerCase();
    return adultIndicators.some(indicator => content.includes(indicator)) ||
           movie.certification === 'NC-17' ||
           movie.title === 'Mr. Singh/Mrs. Mehta'; // Specifically exclude this movie
  }

  generateExplanation(userId, recommendation) {
    const reasons = [];
    
    if (recommendation.cfScore > 7) {
      reasons.push('Users with similar taste highly rated this movie');
    }
    
    if (recommendation.contentScore > 0.7) {
      reasons.push('Similar to movies you enjoyed');
    }
    
    if (recommendation.movie.averageRating > 8.5) {
      reasons.push('Critically acclaimed with high ratings');
    }
    
    if (recommendation.movie.popularity > 80) {
      reasons.push('Popular among viewers');
    }
    
    return reasons;
  }

  calculateConfidence(recommendation) {
    let confidence = 0.5; // Base confidence
    
    if (recommendation.cfScore !== null) confidence += 0.3;
    if (recommendation.contentScore > 0.5) confidence += 0.2;
    if (recommendation.movie.totalRatings > 1000) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  trackUserInteraction(userId, type, data) {
    if (!this.userInteractions.has(userId)) {
      this.userInteractions.set(userId, []);
    }
    
    this.userInteractions.get(userId).push({
      type: type,
      data: data,
      timestamp: Date.now()
    });
  }

  updateUserProfile(userId, movieId, rating) {
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, { preferences: {}, lastUpdated: new Date() });
    }
    
    const profile = this.userProfiles.get(userId);
    profile.lastUpdated = new Date();
    
    // Update preferences based on rating
    const movie = allMovies.find(m => m.id === movieId);
    if (movie && rating >= 7) {
      movie.genres.forEach(genre => {
        profile.preferences[genre] = (profile.preferences[genre] || 0) + 1;
      });
    }
  }

  calculateRatingDistribution(ratings) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };
    ratings.forEach(rating => {
      const rounded = Math.round(rating);
      if (distribution[rounded] !== undefined) {
        distribution[rounded]++;
      }
    });
    return distribution;
  }

  generateUserInsights(userId, userRatings, favoriteGenres) {
    const insights = [];
    
    const ratings = Object.values(userRatings);
    const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
    
    if (avgRating > 8) {
      insights.push({
        type: 'positive',
        message: "You're quite generous with ratings! You seem to enjoy most movies you watch.",
        confidence: 0.8
      });
    } else if (avgRating < 6) {
      insights.push({
        type: 'critical',
        message: "You're quite selective! You have high standards for movies.",
        confidence: 0.8
      });
    }
    
    if (favoriteGenres.length > 0) {
      insights.push({
        type: 'preference',
        message: `You seem to love ${favoriteGenres[0].genre} movies!`,
        confidence: 0.9
      });
    }
    
    return insights;
  }

  generateTestData() {
    // Generate synthetic test data for evaluation
    return {
      users: [],
      totalItems: allMovies.length,
      similarityMatrix: {},
      itemPopularities: {}
    };
  }

  getTotalReviews() {
    let total = 0;
    for (const reviews of this.movieReviews.values()) {
      total += reviews.length;
    }
    return total;
  }
}

export default RecommendationService;
