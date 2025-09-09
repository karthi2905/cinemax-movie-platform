import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const SentimentAnalysis = ({ recommendationService }) => {
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [liveAnalysis, setLiveAnalysis] = useState(null);
  const [popularMovies] = useState([
    { id: '1', title: 'The Shawshank Redemption' },
    { id: '2', title: 'The Godfather' },
    { id: '3', title: 'The Dark Knight' },
    { id: '1218', title: 'Magma: Volcanic Disaster' },
    { id: '1129', title: 'Ju-on' }
  ]);

  useEffect(() => {
    // Analyze review text in real-time
    if (reviewText.trim() && recommendationService.sentimentAnalyzer) {
      const analysis = recommendationService.sentimentAnalyzer.analyzeSentiment(reviewText);
      setLiveAnalysis(analysis);
    } else {
      setLiveAnalysis(null);
    }
  }, [reviewText, recommendationService]);

  const analyzeSentiment = async () => {
    if (!selectedMovieId) return;

    setIsLoading(true);
    try {
      const result = await recommendationService.getMovieSentimentAnalysis(selectedMovieId);
      setSentimentData(result);
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      setSentimentData({
        status: 'error',
        message: 'Failed to analyze sentiment'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'positive') return 'text-success';
    if (sentiment === 'negative') return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment === 'positive') return 'ThumbsUp';
    if (sentiment === 'negative') return 'ThumbsDown';
    return 'Minus';
  };

  const SentimentGauge = ({ score, size = 'large' }) => {
    const normalizedScore = ((score + 1) / 2) * 100; // Convert from -1,1 to 0,100
    const rotation = (normalizedScore / 100) * 180 - 90; // -90 to 90 degrees
    
    const gaugeSize = size === 'large' ? 120 : 80;
    const strokeWidth = size === 'large' ? 8 : 6;
    
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative" style={{ width: gaugeSize, height: gaugeSize / 2 + 20 }}>
          <svg width={gaugeSize} height={gaugeSize / 2 + 20} className="absolute">
            {/* Background arc */}
            <path
              d={`M 10 ${gaugeSize / 2} A ${gaugeSize / 2 - 10} ${gaugeSize / 2 - 10} 0 0 1 ${gaugeSize - 10} ${gaugeSize / 2}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-muted opacity-20"
            />
            {/* Colored segments */}
            <path
              d={`M 10 ${gaugeSize / 2} A ${gaugeSize / 2 - 10} ${gaugeSize / 2 - 10} 0 0 1 ${gaugeSize / 2} 10`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={strokeWidth}
              opacity={0.7}
            />
            <path
              d={`M ${gaugeSize / 2} 10 A ${gaugeSize / 2 - 10} ${gaugeSize / 2 - 10} 0 0 1 ${gaugeSize - 10} ${gaugeSize / 2}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth={strokeWidth}
              opacity={0.7}
            />
          </svg>
          {/* Needle */}
          <div
            className="absolute w-0.5 bg-foreground origin-bottom"
            style={{
              height: gaugeSize / 2 - 15,
              left: '50%',
              bottom: 20,
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transformOrigin: 'bottom center'
            }}
          />
          {/* Center dot */}
          <div
            className="absolute w-3 h-3 bg-foreground rounded-full"
            style={{
              left: '50%',
              bottom: 17,
              transform: 'translateX(-50%)'
            }}
          />
        </div>
        <div className="text-center">
          <div className="text-sm font-medium">{score.toFixed(2)}</div>
          <div className="text-xs text-muted-foreground">Sentiment Score</div>
        </div>
      </div>
    );
  };

  const SentimentDistribution = ({ distribution }) => (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-semibold mb-4 flex items-center space-x-2">
        <Icon name="PieChart" size={18} />
        <span>Sentiment Distribution</span>
      </h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-success">
            {distribution.positive.toFixed(1)}%
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-success">
            <Icon name="ThumbsUp" size={14} />
            <span>Positive</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-muted-foreground">
            {distribution.neutral.toFixed(1)}%
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
            <Icon name="Minus" size={14} />
            <span>Neutral</span>
          </div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-2xl font-bold text-destructive">
            {distribution.negative.toFixed(1)}%
          </div>
          <div className="flex items-center justify-center space-x-1 text-sm text-destructive">
            <Icon name="ThumbsDown" size={14} />
            <span>Negative</span>
          </div>
        </div>
      </div>
    </div>
  );

  const InsightCard = ({ insight }) => {
    const getInsightColor = (type) => {
      switch (type) {
        case 'positive': return 'border-success/20 bg-success/5';
        case 'negative': return 'border-destructive/20 bg-destructive/5';
        case 'mixed': return 'border-warning/20 bg-warning/5';
        case 'volume': return 'border-accent/20 bg-accent/5';
        default: return 'border-border bg-card';
      }
    };

    return (
      <div className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}>
        <div className="flex items-start space-x-3">
          <Icon 
            name="Lightbulb" 
            size={16} 
            className={getSentimentColor(insight.type)} 
          />
          <div className="flex-1 space-y-1">
            <p className="text-sm text-foreground">{insight.message}</p>
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Sentiment Analysis
        </h2>
        <p className="text-muted-foreground">
          Analyze movie reviews and user feedback sentiment
        </p>
      </div>

      {/* Live Review Analyzer */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Icon name="Zap" size={18} />
          <span>Live Review Analyzer</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Write a movie review:
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Type your movie review here to see real-time sentiment analysis..."
              className="w-full h-32 px-3 py-2 border border-border rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          {liveAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getSentimentIcon(liveAnalysis.sentiment)} 
                      size={16} 
                      className={getSentimentColor(liveAnalysis.sentiment)} 
                    />
                    <span className={`font-medium capitalize ${getSentimentColor(liveAnalysis.sentiment)}`}>
                      {liveAnalysis.sentiment}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {Math.round(liveAnalysis.confidence * 100)}% confidence
                  </div>
                </div>
                
                {liveAnalysis.details.analysis.positiveWords.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-success mb-2">
                      Positive words detected:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {liveAnalysis.details.analysis.positiveWords.map((word, i) => (
                        <span key={i} className="px-2 py-1 bg-success/10 text-success text-xs rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {liveAnalysis.details.analysis.negativeWords.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-destructive mb-2">
                      Negative words detected:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {liveAnalysis.details.analysis.negativeWords.map((word, i) => (
                        <span key={i} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <SentimentGauge score={liveAnalysis.score} size="small" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie Sentiment Analysis */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Icon name="Search" size={18} />
          <span>Movie Sentiment Analysis</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(e.target.value)}
              className="flex-1 px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="">Select a movie to analyze...</option>
              {popularMovies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            <button
              onClick={analyzeSentiment}
              disabled={!selectedMovieId || isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name="Search" size={16} />
              )}
            </button>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground">Analyzing sentiment...</p>
            </div>
          )}

          {sentimentData && sentimentData.status === 'success' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Sentiment */}
                <div className="text-center">
                  <SentimentGauge score={sentimentData.sentiment.averageSentiment} />
                </div>

                {/* Distribution */}
                <SentimentDistribution distribution={sentimentData.sentiment.sentimentDistribution} />
              </div>

              {/* Insights */}
              {sentimentData.insights && sentimentData.insights.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Icon name="Lightbulb" size={16} />
                    <span>AI Insights</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sentimentData.insights.map((insight, index) => (
                      <InsightCard key={index} insight={insight} />
                    ))}
                  </div>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">
                    {sentimentData.reviewCount}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Reviews</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">
                    {(sentimentData.sentiment.confidence * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-success">
                    {sentimentData.sentiment.sentimentDistribution.positive.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Positive</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-destructive">
                    {sentimentData.sentiment.sentimentDistribution.negative.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Negative</div>
                </div>
              </div>
            </div>
          )}

          {sentimentData && sentimentData.status === 'error' && (
            <div className="text-center py-8">
              <Icon name="AlertCircle" size={32} className="text-destructive mx-auto mb-2" />
              <p className="text-destructive">{sentimentData.message}</p>
            </div>
          )}

          {!sentimentData && !isLoading && selectedMovieId && (
            <div className="text-center py-8">
              <Icon name="MessageCircle" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Click the analyze button to see sentiment analysis for the selected movie.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
