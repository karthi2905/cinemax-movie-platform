import React from 'react';
import Icon from '../AppIcon';

const UserInsights = ({ userInsights, isLoading, onRefresh }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-4">
              <div className="h-6 bg-muted rounded shimmer mb-2" />
              <div className="h-8 bg-muted rounded shimmer" />
            </div>
          ))}
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="h-6 bg-muted rounded shimmer mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded shimmer" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userInsights || userInsights.status === 'error') {
    return (
      <div className="text-center py-12">
        <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No User Data Available
        </h3>
        <p className="text-muted-foreground mb-4">
          Start rating some movies to see your personalized insights!
        </p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Refresh Insights
        </button>
      </div>
    );
  }

  const { statistics, preferences, insights } = userInsights;

  const StatCard = ({ title, value, icon, trend, trendValue }) => (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon name={icon} size={16} className="text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <div className="flex items-center space-x-1">
            <Icon 
              name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={12} 
              className={trend === 'up' ? 'text-success' : 'text-destructive'} 
            />
            <span className={`text-xs ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const RatingDistribution = ({ distribution }) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const maxCount = Math.max(...Object.values(distribution));

    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Rating Distribution</h3>
          <Icon name="BarChart" size={18} className="text-muted-foreground" />
        </div>
        <div className="grid grid-cols-10 gap-1">
          {Object.entries(distribution).map(([rating, count]) => {
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
            
            return (
              <div key={rating} className="flex flex-col items-center space-y-2">
                <div className="text-xs text-muted-foreground">{count}</div>
                <div 
                  className="w-full bg-primary rounded-t transition-all duration-500 ease-out min-h-1"
                  style={{ height: `${Math.max(height, 4)}px` }}
                  title={`${count} movies (${percentage}%)`}
                />
                <div className="text-xs font-medium">{rating}</div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Rating scale (1-10)
        </p>
      </div>
    );
  };

  const FavoriteGenres = ({ genres }) => (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Favorite Genres</h3>
        <Icon name="Heart" size={18} className="text-muted-foreground" />
      </div>
      {genres.length > 0 ? (
        <div className="space-y-3">
          {genres.map(({ genre, count }, index) => {
            const maxCount = genres[0].count;
            const percentage = (count / maxCount) * 100;
            
            return (
              <div key={genre} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">#{index + 1}</span>
                    <span className="text-foreground">{genre}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{count} movies</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-accent rounded-full h-2 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-4">
          Rate more movies to discover your favorite genres!
        </p>
      )}
    </div>
  );

  const UserInsightCard = ({ insight }) => {
    const getInsightIcon = (type) => {
      switch (type) {
        case 'positive': return { icon: 'ThumbsUp', color: 'text-success' };
        case 'critical': return { icon: 'AlertCircle', color: 'text-warning' };
        case 'preference': return { icon: 'Star', color: 'text-accent' };
        default: return { icon: 'Info', color: 'text-muted-foreground' };
      }
    };

    const { icon, color } = getInsightIcon(insight.type);

    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name={icon} size={20} className={color} />
          <div className="flex-1 space-y-1">
            <p className="text-foreground">{insight.message}</p>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Icon name="Zap" size={12} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            Your Movie Insights
          </h2>
          <p className="text-muted-foreground">
            Discover your viewing patterns and preferences
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <Icon name="RefreshCw" size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Ratings"
          value={statistics.totalRatings}
          icon="Star"
        />
        <StatCard
          title="Average Rating"
          value={`${statistics.averageRating.toFixed(1)}/10`}
          icon="TrendingUp"
        />
        <StatCard
          title="Favorite Genre"
          value={statistics.favoriteGenres[0]?.genre || 'N/A'}
          icon="Heart"
        />
        <StatCard
          title="Total Interactions"
          value={statistics.totalInteractions}
          icon="Activity"
        />
      </div>

      {/* Rating Distribution */}
      <RatingDistribution distribution={statistics.ratingDistribution} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Genres */}
        <FavoriteGenres genres={statistics.favoriteGenres} />

        {/* User Insights */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Lightbulb" size={18} className="text-accent" />
            <h3 className="font-semibold">Personal Insights</h3>
          </div>
          {insights && insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <UserInsightCard key={index} insight={insight} />
              ))}
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-8 text-center">
              <Icon name="Lightbulb" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">
                Rate more movies to get personalized insights!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      {statistics.lastActive && (
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Activity</h3>
            <Icon name="Clock" size={18} className="text-muted-foreground" />
          </div>
          <div className="mt-3 flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Activity" size={14} />
            <span>
              Last active: {new Date(statistics.lastActive).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInsights;
