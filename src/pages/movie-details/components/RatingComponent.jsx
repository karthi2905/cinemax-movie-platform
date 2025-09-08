import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RatingComponent = ({ movie, userRating, onRatingSubmit }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleRatingSubmit = async () => {
    if (selectedRating === 0) return;
    
    setIsSubmitting(true);
    try {
      await onRatingSubmit(selectedRating);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingRemove = async () => {
    setIsSubmitting(true);
    try {
      await onRatingSubmit(0);
      setSelectedRating(0);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    } catch (error) {
      console.error('Failed to remove rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-6 py-8 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-bold text-card-foreground">
              Rate This Movie
            </h2>
            <p className="text-muted-foreground font-body">
              Help improve recommendations by rating "{movie?.title}"
            </p>
          </div>

          {/* Star Rating Interface */}
          <div className="flex justify-center items-center space-x-2">
            {[1, 2, 3, 4, 5]?.map((star) => (
              <button
                key={star}
                className="p-2 rounded-full hover:bg-muted/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => handleRatingClick(star)}
                disabled={isSubmitting}
              >
                <Icon
                  name="Star"
                  size={32}
                  color={
                    star <= (hoveredRating || selectedRating)
                      ? "var(--color-accent)"
                      : "var(--color-muted-foreground)"
                  }
                  className={`transition-colors duration-200 ${
                    star <= (hoveredRating || selectedRating) ? "fill-current" : ""
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Rating Text */}
          <div className="h-6">
            {(hoveredRating || selectedRating) > 0 && (
              <p className="text-lg font-body text-card-foreground">
                {hoveredRating || selectedRating} out of 5 stars
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {selectedRating > 0 && (
              <>
                <Button
                  variant="default"
                  onClick={handleRatingSubmit}
                  loading={isSubmitting}
                  disabled={selectedRating === userRating}
                >
                  {userRating ? "Update Rating" : "Submit Rating"}
                </Button>
                {userRating && (
                  <Button
                    variant="outline"
                    onClick={handleRatingRemove}
                    loading={isSubmitting}
                  >
                    Remove Rating
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Feedback Message */}
          {showFeedback && (
            <div className="flex items-center justify-center space-x-2 p-4 bg-success/10 border border-success/20 rounded-lg">
              <Icon name="Check" size={20} color="var(--color-success)" />
              <span className="text-success font-body">
                {selectedRating === 0 ? "Rating removed successfully!" : "Rating submitted successfully!"}
              </span>
            </div>
          )}

          {/* Rating Impact */}
          {selectedRating > 0 && (
            <div className="p-4 bg-muted/10 border border-border rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Icon name="Zap" size={16} color="var(--color-accent)" />
                <span className="text-sm font-body font-semibold text-card-foreground">
                  How this helps
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                Your rating helps our AI understand your preferences and improves movie recommendations for you and similar users.
              </p>
            </div>
          )}

          {/* Current User Rating Display */}
          {userRating && !showFeedback && (
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground font-body">
              <Icon name="User" size={16} />
              <span>Your current rating: {userRating} stars</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingComponent;