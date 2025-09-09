/**
 * Advanced Movie Recommendation Engine
 * Features: Collaborative Filtering, Matrix Factorization, Cosine Similarity, Content-Based Filtering
 */

class RecommendationEngine {
  constructor() {
    this.userRatings = new Map(); // userId -> {movieId: rating, ...}
    this.movieFeatures = new Map(); // movieId -> feature vector
    this.userProfiles = new Map(); // userId -> user profile/preferences
    this.similarityCache = new Map(); // cache for similarity calculations
    this.modelParams = {
      factors: 50, // number of latent factors for matrix factorization
      learningRate: 0.01,
      regularization: 0.01,
      iterations: 100
    };
  }

  /**
   * COLLABORATIVE FILTERING - User-Based
   */
  calculateUserSimilarity(userId1, userId2) {
    const cacheKey = `${Math.min(userId1, userId2)}_${Math.max(userId1, userId2)}`;
    if (this.similarityCache.has(cacheKey)) {
      return this.similarityCache.get(cacheKey);
    }

    const user1Ratings = this.userRatings.get(userId1) || {};
    const user2Ratings = this.userRatings.get(userId2) || {};
    
    const commonMovies = Object.keys(user1Ratings).filter(movieId => 
      movieId in user2Ratings
    );

    if (commonMovies.length === 0) return 0;

    const similarity = this.cosineSimilarity(
      commonMovies.map(id => user1Ratings[id]),
      commonMovies.map(id => user2Ratings[id])
    );

    this.similarityCache.set(cacheKey, similarity);
    return similarity;
  }

  /**
   * COSINE SIMILARITY CALCULATION
   */
  cosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      normA += vectorA[i] * vectorA[i];
      normB += vectorB[i] * vectorB[i];
    }

    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * COLLABORATIVE FILTERING PREDICTIONS
   */
  collaborativeFiltering(userId, movieId, k = 10) {
    const userRatings = this.userRatings.get(userId);
    if (!userRatings) return null;

    // Find k most similar users who rated this movie
    const similarities = [];
    
    for (const [otherUserId, otherRatings] of this.userRatings.entries()) {
      if (otherUserId !== userId && movieId in otherRatings) {
        const similarity = this.calculateUserSimilarity(userId, otherUserId);
        if (similarity > 0) {
          similarities.push({
            userId: otherUserId,
            similarity: similarity,
            rating: otherRatings[movieId]
          });
        }
      }
    }

    // Sort by similarity and take top k
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topSimilar = similarities.slice(0, k);

    if (topSimilar.length === 0) return null;

    // Calculate weighted average prediction
    let numerator = 0;
    let denominator = 0;
    
    for (const sim of topSimilar) {
      numerator += sim.similarity * sim.rating;
      denominator += Math.abs(sim.similarity);
    }

    return denominator === 0 ? null : numerator / denominator;
  }

  /**
   * MATRIX FACTORIZATION using Gradient Descent
   */
  async matrixFactorization(ratingsMatrix, userFeatures, movieFeatures) {
    const { factors, learningRate, regularization, iterations } = this.modelParams;

    for (let iter = 0; iter < iterations; iter++) {
      for (const [userId, ratings] of ratingsMatrix.entries()) {
        for (const [movieId, rating] of Object.entries(ratings)) {
          const userIdx = parseInt(userId);
          const movieIdx = parseInt(movieId);

          // Calculate prediction
          let prediction = 0;
          for (let f = 0; f < factors; f++) {
            prediction += userFeatures[userIdx][f] * movieFeatures[movieIdx][f];
          }

          // Calculate error
          const error = rating - prediction;

          // Update features using gradient descent
          for (let f = 0; f < factors; f++) {
            const userFeat = userFeatures[userIdx][f];
            const movieFeat = movieFeatures[movieIdx][f];

            userFeatures[userIdx][f] += learningRate * (error * movieFeat - regularization * userFeat);
            movieFeatures[movieIdx][f] += learningRate * (error * userFeat - regularization * movieFeat);
          }
        }
      }

      // Calculate RMSE every 10 iterations
      if (iter % 10 === 0) {
        const rmse = this.calculateRMSE(ratingsMatrix, userFeatures, movieFeatures);
        console.log(`Iteration ${iter}, RMSE: ${rmse.toFixed(4)}`);
      }
    }

    return { userFeatures, movieFeatures };
  }

  /**
   * CONTENT-BASED FILTERING
   */
  contentBasedSimilarity(movie1, movie2) {
    // Create feature vectors for movies
    const features1 = this.createMovieFeatureVector(movie1);
    const features2 = this.createMovieFeatureVector(movie2);
    
    return this.cosineSimilarity(features1, features2);
  }

  createMovieFeatureVector(movie) {
    const vector = [];
    
    // Genre features (one-hot encoding)
    const allGenres = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];
    allGenres.forEach(genre => {
      vector.push(movie.genres.includes(genre) ? 1 : 0);
    });
    
    // Year normalized (0-1 scale)
    const currentYear = new Date().getFullYear();
    const minYear = 1900;
    vector.push((movie.releaseYear - minYear) / (currentYear - minYear));
    
    // Rating normalized
    vector.push(movie.averageRating / 10);
    
    // Runtime normalized
    vector.push(Math.min(movie.runtime / 300, 1)); // Cap at 5 hours
    
    // Popularity normalized
    vector.push(Math.min(movie.popularity / 100, 1));
    
    return vector;
  }

  /**
   * HYBRID RECOMMENDATIONS
   */
  async getHybridRecommendations(userId, movies, options = {}) {
    const {
      contentWeight = 0.3,
      collaborativeWeight = 0.7,
      minRating = 7.0,
      count = 10,
      excludeWatched = true
    } = options;

    const recommendations = [];
    const userRatings = this.userRatings.get(userId) || {};
    
    for (const movie of movies) {
      // Skip if user already rated this movie
      if (excludeWatched && movie.id in userRatings) continue;
      
      // Skip if below minimum rating threshold
      if (movie.averageRating < minRating) continue;

      let score = 0;
      
      // Collaborative filtering score
      const cfScore = this.collaborativeFiltering(userId, movie.id);
      if (cfScore !== null) {
        score += collaborativeWeight * (cfScore / 10); // normalize to 0-1
      }
      
      // Content-based score
      const contentScore = this.calculateContentBasedScore(userId, movie);
      score += contentWeight * contentScore;
      
      recommendations.push({
        movie: movie,
        score: score,
        cfScore: cfScore,
        contentScore: contentScore
      });
    }
    
    // Sort by score and return top recommendations
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  }

  calculateContentBasedScore(userId, movie) {
    const userRatings = this.userRatings.get(userId) || {};
    const likedMovies = Object.keys(userRatings)
      .filter(movieId => userRatings[movieId] >= 7)
      .map(movieId => this.getMovieById(movieId))
      .filter(Boolean);
    
    if (likedMovies.length === 0) return movie.averageRating / 10;
    
    // Calculate average similarity to liked movies
    let totalSimilarity = 0;
    for (const likedMovie of likedMovies) {
      totalSimilarity += this.contentBasedSimilarity(movie, likedMovie);
    }
    
    return totalSimilarity / likedMovies.length;
  }

  /**
   * EVALUATION METRICS
   */
  calculateRMSE(ratingsMatrix, userFeatures, movieFeatures) {
    let sumSquaredError = 0;
    let count = 0;
    
    for (const [userId, ratings] of ratingsMatrix.entries()) {
      for (const [movieId, actualRating] of Object.entries(ratings)) {
        const userIdx = parseInt(userId);
        const movieIdx = parseInt(movieId);
        
        let prediction = 0;
        for (let f = 0; f < this.modelParams.factors; f++) {
          prediction += userFeatures[userIdx][f] * movieFeatures[movieIdx][f];
        }
        
        sumSquaredError += Math.pow(actualRating - prediction, 2);
        count++;
      }
    }
    
    return Math.sqrt(sumSquaredError / count);
  }

  calculatePrecisionRecall(recommendations, testSet, threshold = 7) {
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;
    
    const recommendedIds = new Set(recommendations.map(r => r.movie.id));
    const relevantIds = new Set(
      Object.keys(testSet).filter(movieId => testSet[movieId] >= threshold)
    );
    
    for (const movieId of recommendedIds) {
      if (relevantIds.has(movieId)) {
        truePositives++;
      } else {
        falsePositives++;
      }
    }
    
    for (const movieId of relevantIds) {
      if (!recommendedIds.has(movieId)) {
        falseNegatives++;
      }
    }
    
    const precision = truePositives / (truePositives + falsePositives) || 0;
    const recall = truePositives / (truePositives + falseNegatives) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    
    return { precision, recall, f1Score };
  }

  /**
   * COLD START SOLUTIONS
   */
  handleColdStart(userId, userPreferences = {}) {
    // For new users, use content-based recommendations
    const { favoriteGenres = [], minRating = 7.0, preferredYears = [] } = userPreferences;
    
    // Create a pseudo user profile based on popular movies in preferred genres
    const coldStartRecommendations = [];
    
    // Get popular movies from preferred genres
    // This would typically come from your movie database
    // For now, we'll use a placeholder approach
    
    return this.getPopularMoviesByGenres(favoriteGenres, { minRating, count: 20 });
  }

  getPopularMoviesByGenres(genres, options = {}) {
    // This would integrate with your movie database
    // Return popular movies from specified genres
    return []; // Placeholder
  }

  /**
   * UTILITY METHODS
   */
  addUserRating(userId, movieId, rating) {
    if (!this.userRatings.has(userId)) {
      this.userRatings.set(userId, {});
    }
    this.userRatings.get(userId)[movieId] = rating;
  }

  getMovieById(movieId) {
    // This would integrate with your movie database
    return null; // Placeholder
  }

  /**
   * INITIALIZE WITH SAMPLE DATA (for testing)
   */
  initializeWithSampleData() {
    // Sample user ratings
    this.addUserRating('user1', '1', 9);
    this.addUserRating('user1', '2', 8);
    this.addUserRating('user1', '3', 7);
    
    this.addUserRating('user2', '1', 8);
    this.addUserRating('user2', '2', 9);
    this.addUserRating('user2', '4', 8);
    
    this.addUserRating('user3', '3', 9);
    this.addUserRating('user3', '4', 8);
    this.addUserRating('user3', '5', 7);
  }
}

export default RecommendationEngine;
