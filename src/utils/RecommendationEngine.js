class RecommendationEngine {
  constructor() {
    this.userProfiles = new Map();
    this.movieFeatures = new Map();
    this.ratings = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    // Initialize with demo data
    this.loadDemoData();
    this.isInitialized = true;
  }

  loadDemoData() {
    // Demo user profiles
    this.userProfiles.set('demo_user', {
      id: 'demo_user',
      preferences: {
        genres: { 'Action': 0.8, 'Drama': 0.6, 'Horror': 0.3, 'Comedy': 0.7 },
        actors: { 'Leonardo DiCaprio': 0.9, 'Morgan Freeman': 0.8 },
        directors: { 'Christopher Nolan': 0.9, 'Quentin Tarantino': 0.7 }
      },
      ratings: [
        { movieId: '1', rating: 5, timestamp: Date.now() },
        { movieId: '2', rating: 4, timestamp: Date.now() },
        { movieId: '3', rating: 5, timestamp: Date.now() }
      ],
      watchHistory: ['1', '2', '3', '1218', '1129']
    });

    // Demo movie features
    this.movieFeatures.set('1', {
      id: '1',
      title: 'The Shawshank Redemption',
      genres: ['Drama'],
      year: 1994,
      rating: 9.3,
      features: [0.1, 0.9, 0.8, 0.2, 0.1] // Normalized feature vector
    });

    this.movieFeatures.set('2', {
      id: '2',
      title: 'The Godfather',
      genres: ['Crime', 'Drama'],
      year: 1972,
      rating: 9.2,
      features: [0.2, 0.8, 0.9, 0.1, 0.1]
    });

    this.movieFeatures.set('3', {
      id: '3',
      title: 'The Dark Knight',
      genres: ['Action', 'Crime', 'Drama'],
      year: 2008,
      rating: 9.0,
      features: [0.8, 0.5, 0.7, 0.3, 0.2]
    });
  }

  async getUserInsights(userId = 'demo_user') {
    if (!this.isInitialized) await this.initialize();

    const userProfile = this.userProfiles.get(userId) || this.userProfiles.get('demo_user');
    
    return {
      status: 'success',
      insights: {
        totalRatings: userProfile.ratings.length,
        averageRating: userProfile.ratings.reduce((sum, r) => sum + r.rating, 0) / userProfile.ratings.length,
        favoriteGenres: Object.entries(userProfile.preferences.genres)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3),
        ratingDistribution: {
          5: userProfile.ratings.filter(r => r.rating === 5).length,
          4: userProfile.ratings.filter(r => r.rating === 4).length,
          3: userProfile.ratings.filter(r => r.rating === 3).length,
          2: userProfile.ratings.filter(r => r.rating === 2).length,
          1: userProfile.ratings.filter(r => r.rating === 1).length
        },
        watchStreak: Math.floor(Math.random() * 15) + 5,
        personalityInsights: [
          "You prefer critically acclaimed dramas and thrillers",
          "You have a strong preference for award-winning films",
          "You enjoy complex narratives and character development",
          "You tend to rate movies higher than average users"
        ]
      }
    };
  }

  async getMovieSentimentAnalysis(movieId) {
    if (!this.isInitialized) await this.initialize();

    // Demo sentiment analysis
    const sentimentScores = [0.8, -0.2, 0.6, 0.1, -0.4, 0.9, 0.3];
    const averageSentiment = sentimentScores.reduce((sum, s) => sum + s, 0) / sentimentScores.length;
    
    const positive = sentimentScores.filter(s => s > 0.1).length;
    const negative = sentimentScores.filter(s => s < -0.1).length;
    const neutral = sentimentScores.length - positive - negative;

    return {
      status: 'success',
      sentiment: {
        averageSentiment: averageSentiment,
        confidence: 0.87,
        sentimentDistribution: {
          positive: (positive / sentimentScores.length) * 100,
          neutral: (neutral / sentimentScores.length) * 100,
          negative: (negative / sentimentScores.length) * 100
        }
      },
      reviewCount: sentimentScores.length,
      insights: [
        {
          type: 'positive',
          message: 'Most users respond positively to this movie',
          confidence: 0.85
        },
        {
          type: 'volume',
          message: 'This movie has generated significant discussion',
          confidence: 0.92
        }
      ]
    };
  }

  async findSimilarMovies(movieId, options = {}) {
    if (!this.isInitialized) await this.initialize();

    const targetMovie = this.movieFeatures.get(movieId);
    if (!targetMovie) {
      return { movies: [] };
    }

    // Generate similar movies based on method
    const similarMovies = [];
    const allMovies = Array.from(this.movieFeatures.values()).filter(m => m.id !== movieId);

    for (const movie of allMovies.slice(0, options.limit || 8)) {
      const similarity = this.calculateCosineSimilarity(targetMovie.features, movie.features);
      
      similarMovies.push({
        id: movie.id,
        title: movie.title,
        year: movie.year,
        genre: movie.genres[0],
        rating: movie.rating,
        similarity: similarity,
        posterUrl: `https://image.tmdb.org/t/p/w300/poster${movie.id}.jpg`,
        synopsis: `A compelling ${movie.genres[0].toLowerCase()} film from ${movie.year}.`
      });
    }

    return {
      movies: similarMovies.sort((a, b) => b.similarity - a.similarity)
    };
  }

  calculateCosineSimilarity(vectorA, vectorB) {
    const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async getSystemMetrics(options = {}) {
    if (!this.isInitialized) await this.initialize();

    return {
      overview: {
        totalRecommendations: 15420,
        successfulRecommendations: 12336,
        accuracy: 0.85,
        userSatisfaction: 0.78,
        systemUptime: 0.994
      },
      performance: {
        rmse: 0.82,
        mae: 0.67,
        precision: 0.73,
        recall: 0.68,
        f1Score: 0.70,
        auc: 0.82
      },
      algorithms: {
        collaborative: { accuracy: 0.81, usage: 45, avgResponseTime: 120 },
        content: { accuracy: 0.77, usage: 35, avgResponseTime: 85 },
        hybrid: { accuracy: 0.88, usage: 20, avgResponseTime: 150 }
      },
      system: {
        avgResponseTime: 112,
        memoryUsage: 68,
        cpuUsage: 45,
        cacheHitRate: 0.92,
        dataFreshness: 0.95
      },
      userBehavior: {
        clickThroughRate: 0.34,
        conversionRate: 0.12,
        averageSessionTime: 8.5,
        bounceRate: 0.28
      },
      historical: [
        { date: '2024-01-01', accuracy: 0.82, precision: 0.70, recall: 0.65, rmse: 0.85 },
        { date: '2024-01-02', accuracy: 0.83, precision: 0.71, recall: 0.66, rmse: 0.84 },
        { date: '2024-01-03', accuracy: 0.84, precision: 0.72, recall: 0.67, rmse: 0.83 },
        { date: '2024-01-04', accuracy: 0.85, precision: 0.73, recall: 0.68, rmse: 0.82 },
        { date: '2024-01-05', accuracy: 0.86, precision: 0.74, recall: 0.69, rmse: 0.81 },
        { date: '2024-01-06', accuracy: 0.85, precision: 0.73, recall: 0.68, rmse: 0.82 },
        { date: '2024-01-07', accuracy: 0.85, precision: 0.73, recall: 0.68, rmse: 0.82 }
      ]
    };
  }

  async getRecommendations(userId, options = {}) {
    if (!this.isInitialized) await this.initialize();

    const userProfile = this.userProfiles.get(userId) || this.userProfiles.get('demo_user');
    const recommendations = [];

    // Generate recommendations based on user preferences
    for (const [movieId, movie] of this.movieFeatures) {
      if (!userProfile.watchHistory.includes(movieId)) {
        const score = this.calculateRecommendationScore(userProfile, movie);
        recommendations.push({
          movieId: movieId,
          title: movie.title,
          score: score,
          reason: `Recommended because you like ${movie.genres[0]} movies`
        });
      }
    }

    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, options.limit || 10);
  }

  calculateRecommendationScore(userProfile, movie) {
    let score = 0;
    
    // Genre preference
    for (const genre of movie.genres) {
      score += userProfile.preferences.genres[genre] || 0;
    }
    
    // Rating bias
    score += (movie.rating / 10) * 0.3;
    
    // Add some randomness
    score += Math.random() * 0.1;
    
    return Math.min(score, 1);
  }

  async trainModel() {
    // Simulate model training
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          status: 'success',
          message: 'Model training completed',
          metrics: {
            accuracy: 0.87,
            rmse: 0.79
          }
        });
      }, 2000);
    });
  }
}

export default RecommendationEngine;
