import React, { useState } from 'react';
import Image from '../AppImage';
import Icon from '../AppIcon';

const RecommendationCard = ({ recommendation, rank, onRate }) => {
  const [userRating, setUserRating] = useState(0);
  const [isRating, setIsRating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { movie, score, confidence, reasons, sentimentScore, predictionDetails } = recommendation;

  const handleRating = async (rating) => {
    setIsRating(true);
    try {
      await onRate(movie.id, rating);
      setUserRating(rating);
    } catch (error) {
      console.error('Rating error:', error);
    } finally {
      setIsRating(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-success';
    if (score >= 0.6) return 'text-accent';
    if (score >= 0.4) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.3) return { icon: 'ThumbsUp', color: 'text-success' };
    if (sentiment < -0.3) return { icon: 'ThumbsDown', color: 'text-destructive' };
    return { icon: 'Minus', color: 'text-muted-foreground' };
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const sentimentIcon = getSentimentIcon(sentimentScore);

  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          #{rank}
        </div>
      </div>

      {/* Movie Poster */}
      <div className="relative aspect-[2/3] bg-muted">
        <Image
          src={movie.posterImage}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {/* Confidence Score */}
        <div className="absolute top-2 right-2">
          <div className={`bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full ${getScoreColor(confidence)}`}>
            {Math.round(confidence * 100)}% match
          </div>
        </div>

        {/* Sentiment Score */}
        <div className="absolute bottom-2 left-2">
          <div className="bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
            <Icon name={sentimentIcon.icon} size={12} className={sentimentIcon.color} />
            <span>Sentiment</span>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="p-4 space-y-3">
        {/* Title and Year */}
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
            {movie.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
            <span>{movie.releaseYear}</span>
            <span>•</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Icon name="Star" size={12} className="text-accent" />
              <span>{movie.averageRating}/10</span>
            </div>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {movie.genres.slice(0, 3).map(genre => (
            <span
              key={genre}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full"
            >
              {genre}
            </span>
          ))}
          {movie.genres.length > 3 && (
            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
              +{movie.genres.length - 3}
            </span>
          )}
        </div>

        {/* Recommendation Reasons */}
        {reasons && reasons.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Why recommended:
            </h4>
            <ul className="text-xs space-y-1">
              {reasons.slice(0, 2).map((reason, index) => (
                <li key={index} className="flex items-start space-x-1">
                  <Icon name="Check" size={10} className="text-success mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prediction Details (collapsible) */}
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon name={showDetails ? "ChevronUp" : "ChevronDown"} size={12} />
            <span>Prediction Details</span>
          </button>
          
          {showDetails && (
            <div className="mt-2 space-y-2 text-xs bg-muted/50 rounded p-2">
              <div className="flex justify-between">
                <span>Collaborative Score:</span>
                <span className={getScoreColor(predictionDetails.collaborativeScore / 10 || 0)}>
                  {predictionDetails.collaborativeScore ? `${predictionDetails.collaborativeScore.toFixed(1)}/10` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Content Score:</span>
                <span className={getScoreColor(predictionDetails.contentScore)}>
                  {(predictionDetails.contentScore * 10).toFixed(1)}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hybrid Score:</span>
                <span className={getScoreColor(predictionDetails.hybridScore)}>
                  {(predictionDetails.hybridScore * 10).toFixed(1)}/10
                </span>
              </div>
              <div className="flex justify-between">
                <span>Confidence:</span>
                <span className={getScoreColor(confidence)}>
                  {Math.round(confidence * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User Rating */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Rate this movie:</h4>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(rating => (
              <button
                key={rating}
                onClick={() => handleRating(rating)}
                disabled={isRating}
                className={`flex items-center justify-center w-6 h-6 rounded text-xs transition-colors ${
                  userRating >= rating
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                } ${isRating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {rating}
              </button>
            ))}
          </div>
          {userRating > 0 && (
            <p className="text-xs text-success mt-1">
              Thanks for rating! Your rating: {userRating}/10
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Icon name="Play" size={14} className="inline mr-1" />
            Watch Now
          </button>
          <button className="px-3 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors">
            <Icon name="Plus" size={14} />
          </button>
          <button className="px-3 py-2 border border-border rounded-md text-sm hover:bg-muted transition-colors">
            <Icon name="Info" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
