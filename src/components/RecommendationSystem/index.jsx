import React, { useState, useEffect } from 'react';
import RecommendationService from '../../services/recommendationService';
import RecommendationCard from './RecommendationCard';
import UserInsights from './UserInsights';
import SentimentAnalysis from './SentimentAnalysis';
import SimilarMovies from './SimilarMovies';
import SystemMetrics from './SystemMetrics';
import Icon from '../AppIcon';

const RecommendationSystem = ({ userId = 'demo_user' }) => {
  const [recommendationService] = useState(() => new RecommendationService());
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [userInsights, setUserInsights] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  const [filters, setFilters] = useState({
    preferredGenres: [],
    avoidGenres: [],
    minRating: 7.0,
    count: 10,
    filterAdultContent: true
  });
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Available genres
  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 
    'Family', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 
    'Thriller', 'War', 'Western'
  ];

  useEffect(() => {
    initializeSystem();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      loadRecommendations();
    }
  }, [filters, isInitialized]);

  const initializeSystem = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await recommendationService.initialize();
      
      if (result.status === 'success') {
        setIsInitialized(true);
        await loadUserInsights();
        await loadSystemMetrics();
      } else {
        setError('Failed to initialize recommendation system');
      }
    } catch (err) {
      console.error('Initialization error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      const result = await recommendationService.getPersonalizedRecommendations(
        userId, 
        {
          ...filters,
          includeExplanation: true,
          includeSentiment: true
        }
      );
      
      if (result.status === 'success') {
        setRecommendations(result.recommendations);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Recommendation error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserInsights = async () => {
    try {
      const result = await recommendationService.getUserInsights(userId);
      if (result.status === 'success') {
        setUserInsights(result);
      }
    } catch (err) {
      console.error('User insights error:', err);
    }
  };

  const loadSystemMetrics = async () => {
    try {
      const result = await recommendationService.evaluateSystem();
      if (result.status === 'success') {
        setSystemMetrics(result);
      }
    } catch (err) {
      console.error('System metrics error:', err);
    }
  };

  const handleRating = async (movieId, rating, review = null) => {
    try {
      const result = await recommendationService.addUserRating(
        userId, 
        movieId, 
        rating, 
        review
      );
      
      if (result.status === 'success') {
        // Refresh recommendations and insights
        await loadRecommendations();
        await loadUserInsights();
        
        // Show success message
        showNotification('Rating added successfully!', 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (err) {
      console.error('Rating error:', err);
      showNotification(err.message, 'error');
    }
  };

  const handleGenreToggle = (genre, type) => {
    if (type === 'preferred') {
      setFilters(prev => ({
        ...prev,
        preferredGenres: prev.preferredGenres.includes(genre)
          ? prev.preferredGenres.filter(g => g !== genre)
          : [...prev.preferredGenres, genre]
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        avoidGenres: prev.avoidGenres.includes(genre)
          ? prev.avoidGenres.filter(g => g !== genre)
          : [...prev.avoidGenres, genre]
      }));
    }
  };

  const showNotification = (message, type) => {
    // This would typically integrate with your notification system
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        active
          ? 'bg-primary text-white shadow-md'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
    >
      <Icon name={icon} size={18} />
      <span>{label}</span>
    </button>
  );

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={20} className="text-destructive" />
            <h3 className="font-semibold text-destructive">System Error</h3>
          </div>
          <p className="text-destructive mt-2">{error}</p>
          <button
            onClick={initializeSystem}
            className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          AI Movie Recommendations
        </h1>
        <p className="text-muted-foreground">
          Powered by collaborative filtering, sentiment analysis, and machine learning
        </p>
        {userInsights && (
          <div className="flex items-center justify-center space-x-4 text-sm">
            <span className="flex items-center space-x-1">
              <Icon name="Star" size={16} className="text-accent" />
              <span>{userInsights.statistics.totalRatings} ratings</span>
            </span>
            <span className="flex items-center space-x-1">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span>{userInsights.statistics.averageRating.toFixed(1)} avg rating</span>
            </span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <TabButton
          id="recommendations"
          label="Recommendations"
          icon="Sparkles"
          active={activeTab === 'recommendations'}
          onClick={setActiveTab}
        />
        <TabButton
          id="insights"
          label="Your Insights"
          icon="User"
          active={activeTab === 'insights'}
          onClick={setActiveTab}
        />
        <TabButton
          id="similar"
          label="Similar Movies"
          icon="GitBranch"
          active={activeTab === 'similar'}
          onClick={setActiveTab}
        />
        <TabButton
          id="sentiment"
          label="Sentiment Analysis"
          icon="MessageCircle"
          active={activeTab === 'sentiment'}
          onClick={setActiveTab}
        />
        <TabButton
          id="metrics"
          label="System Metrics"
          icon="BarChart"
          active={activeTab === 'metrics'}
          onClick={setActiveTab}
        />
      </div>

      {/* Filters (only show on recommendations tab) */}
      {activeTab === 'recommendations' && (
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <h3 className="font-semibold flex items-center space-x-2">
            <Icon name="Filter" size={18} />
            <span>Recommendation Filters</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preferred Genres */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Preferred Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre, 'preferred')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.preferredGenres.includes(genre)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Avoid Genres */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Avoid Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre, 'avoid')}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.avoidGenres.includes(genre)
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Min Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimum Rating
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <div className="text-center text-sm text-muted-foreground mt-1">
                {filters.minRating}/10
              </div>
            </div>

            {/* Count */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Recommendations
              </label>
              <select
                value={filters.count}
                onChange={(e) => setFilters(prev => ({ ...prev, count: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value={5}>5 movies</option>
                <option value={10}>10 movies</option>
                <option value={15}>15 movies</option>
                <option value={20}>20 movies</option>
              </select>
            </div>

            {/* Adult Content Filter */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.filterAdultContent}
                  onChange={(e) => setFilters(prev => ({ ...prev, filterAdultContent: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm font-medium">Filter Adult Content</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      <div className="min-h-96">
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border rounded-lg p-4 space-y-3">
                    <div className="w-full h-48 bg-muted rounded shimmer" />
                    <div className="h-4 bg-muted rounded shimmer" />
                    <div className="h-4 bg-muted rounded shimmer w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendations.map((recommendation, index) => (
                      <RecommendationCard
                        key={recommendation.movie.id}
                        recommendation={recommendation}
                        rank={index + 1}
                        onRate={handleRating}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No Recommendations Found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or add some movie ratings to get personalized recommendations.
                    </p>
                    <button
                      onClick={loadRecommendations}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                      Refresh Recommendations
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <UserInsights 
            userInsights={userInsights} 
            isLoading={isLoading}
            onRefresh={loadUserInsights}
          />
        )}

        {activeTab === 'similar' && (
          <SimilarMovies 
            recommendationService={recommendationService}
            onRate={handleRating}
          />
        )}

        {activeTab === 'sentiment' && (
          <SentimentAnalysis 
            recommendationService={recommendationService}
          />
        )}

        {activeTab === 'metrics' && (
          <SystemMetrics 
            systemMetrics={systemMetrics}
            isLoading={isLoading}
            onRefresh={loadSystemMetrics}
          />
        )}
      </div>
    </div>
  );
};

export default RecommendationSystem;
