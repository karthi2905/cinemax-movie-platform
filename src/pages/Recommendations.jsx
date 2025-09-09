import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Icon from '../components/AppIcon';
import RecommendationEngine from '../utils/RecommendationEngine';
import SentimentAnalyzer from '../utils/SentimentAnalyzer';

// Import recommendation components
import UserInsights from '../components/RecommendationSystem/UserInsights';
import SentimentAnalysis from '../components/RecommendationSystem/SentimentAnalysis';
import SimilarMovies from '../components/RecommendationSystem/SimilarMovies';
import SystemMetrics from '../components/RecommendationSystem/SystemMetrics';

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [recommendationService, setRecommendationService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeRecommendationSystem();
  }, []);

  const initializeRecommendationSystem = async () => {
    try {
      // Initialize the recommendation engine
      const engine = new RecommendationEngine();
      await engine.initialize();

      // Initialize sentiment analyzer
      const sentimentAnalyzer = new SentimentAnalyzer();
      
      // Create the recommendation service with all capabilities
      const service = {
        engine,
        sentimentAnalyzer,
        
        // User insights methods
        async getUserInsights(userId = 'demo_user') {
          return engine.getUserInsights(userId);
        },

        // Sentiment analysis methods
        async getMovieSentimentAnalysis(movieId) {
          return engine.getMovieSentimentAnalysis(movieId);
        },

        // Similar movies methods
        async findSimilarMovies(movieId, options = {}) {
          return engine.findSimilarMovies(movieId, options);
        },

        // System metrics methods
        async getSystemMetrics(options = {}) {
          return engine.getSystemMetrics(options);
        },

        // Additional utility methods
        async getRecommendations(userId, options = {}) {
          return engine.getRecommendations(userId, options);
        },

        async trainModel() {
          return engine.trainModel();
        }
      };

      setRecommendationService(service);
    } catch (error) {
      console.error('Failed to initialize recommendation system:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      id: 'insights',
      label: 'User Insights',
      icon: 'User',
      description: 'Personal movie preferences and analytics'
    },
    {
      id: 'sentiment',
      label: 'Sentiment Analysis',
      icon: 'MessageCircle',
      description: 'Review sentiment and mood analysis'
    },
    {
      id: 'similar',
      label: 'Similar Movies',
      icon: 'Search',
      description: 'Find movies similar to your favorites'
    },
    {
      id: 'metrics',
      label: 'System Metrics',
      icon: 'BarChart3',
      description: 'AI performance and analytics'
    }
  ];

  const renderTabContent = () => {
    if (!recommendationService) {
      return (
        <div className="text-center py-12">
          <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Failed to initialize recommendation system. Please refresh the page.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'insights':
        return <UserInsights recommendationService={recommendationService} />;
      case 'sentiment':
        return <SentimentAnalysis recommendationService={recommendationService} />;
      case 'similar':
        return <SimilarMovies recommendationService={recommendationService} />;
      case 'metrics':
        return <SystemMetrics recommendationService={recommendationService} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>AI Recommendations - Cinemax</title>
          <meta name="description" content="Advanced AI-powered movie recommendations and analytics" />
        </Helmet>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <Icon name="Loader2" size={64} className="animate-spin text-primary mx-auto" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Initializing AI Recommendation System
                </h2>
                <p className="text-muted-foreground mt-2">
                  Setting up machine learning models and analytics...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AI Recommendations - Cinemax</title>
        <meta name="description" content="Advanced AI-powered movie recommendations and analytics" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Brain" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                AI Recommendations
              </h1>
              <p className="text-muted-foreground">
                Advanced machine learning-powered movie recommendations and analytics
              </p>
            </div>
          </div>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Zap" size={16} className="text-primary" />
                <span className="font-medium text-sm">Collaborative Filtering</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Matrix factorization and user-based recommendations
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="MessageCircle" size={16} className="text-primary" />
                <span className="font-medium text-sm">Sentiment Analysis</span>
              </div>
              <p className="text-xs text-muted-foreground">
                NLP-powered review sentiment understanding
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Target" size={16} className="text-primary" />
                <span className="font-medium text-sm">Cosine Similarity</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Content-based similarity matching
              </p>
            </div>
            
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="BarChart3" size={16} className="text-primary" />
                <span className="font-medium text-sm">Performance Metrics</span>
              </div>
              <p className="text-xs text-muted-foreground">
                RMSE, precision, recall evaluation
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card border rounded-lg mb-6">
          <div className="border-b">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 px-6 py-4 border-b-2 transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary bg-primary/5'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <div className="text-left">
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card border rounded-lg">
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="font-medium text-success">Privacy Protected</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Your viewing data and preferences are processed locally and used only to improve your 
              movie recommendations. We employ advanced machine learning techniques including 
              collaborative filtering, content-based filtering, and sentiment analysis to provide 
              personalized suggestions while maintaining your privacy.
            </p>
            
            <div className="flex items-center justify-center space-x-6 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Database" size={12} />
                <span>Local Processing</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Lock" size={12} />
                <span>Encrypted Data</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Eye" size={12} />
                <span>No Tracking</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Trash2" size={12} />
                <span>Data Control</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
