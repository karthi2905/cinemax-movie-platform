import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const SystemMetrics = ({ recommendationService }) => {
  const [metrics, setMetrics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [selectedMetricType, setSelectedMetricType] = useState('all');
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    loadMetrics();
  }, [selectedTimeRange, selectedMetricType]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const result = await recommendationService.getSystemMetrics({
        timeRange: selectedTimeRange,
        metricType: selectedMetricType
      });
      setMetrics(result);
      setHistoricalData(result.historical || []);
    } catch (error) {
      console.error('Metrics loading error:', error);
      // Fallback to demo data
      setMetrics(getDemoMetrics());
      setHistoricalData(getDemoHistoricalData());
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoMetrics = () => ({
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
    }
  });

  const getDemoHistoricalData = () => [
    { date: '2024-01-01', accuracy: 0.82, precision: 0.70, recall: 0.65, rmse: 0.85 },
    { date: '2024-01-02', accuracy: 0.83, precision: 0.71, recall: 0.66, rmse: 0.84 },
    { date: '2024-01-03', accuracy: 0.84, precision: 0.72, recall: 0.67, rmse: 0.83 },
    { date: '2024-01-04', accuracy: 0.85, precision: 0.73, recall: 0.68, rmse: 0.82 },
    { date: '2024-01-05', accuracy: 0.86, precision: 0.74, recall: 0.69, rmse: 0.81 },
    { date: '2024-01-06', accuracy: 0.85, precision: 0.73, recall: 0.68, rmse: 0.82 },
    { date: '2024-01-07', accuracy: 0.85, precision: 0.73, recall: 0.68, rmse: 0.82 }
  ];

  const MetricCard = ({ title, value, unit, icon, trend, color = 'primary' }) => {
    const getTrendIcon = () => {
      if (trend > 0) return 'TrendingUp';
      if (trend < 0) return 'TrendingDown';
      return 'Minus';
    };

    const getTrendColor = () => {
      if (trend > 0) return 'text-success';
      if (trend < 0) return 'text-destructive';
      return 'text-muted-foreground';
    };

    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon name={icon} size={16} className={`text-${color}`} />
            <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              <Icon name={getTrendIcon()} size={12} />
              <span className="text-xs font-medium">
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold text-foreground">
            {typeof value === 'number' && value < 1 && value > 0 
              ? `${(value * 100).toFixed(1)}%`
              : typeof value === 'number'
              ? value.toLocaleString()
              : value
            }
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </div>
        </div>
      </div>
    );
  };

  const PerformanceChart = ({ data, metric, color = '#3b82f6' }) => {
    const maxValue = Math.max(...data.map(d => d[metric]));
    const minValue = Math.min(...data.map(d => d[metric]));
    const range = maxValue - minValue;

    return (
      <div className="h-24 flex items-end space-x-1">
        {data.map((point, index) => {
          const height = range > 0 ? ((point[metric] - minValue) / range) * 80 + 10 : 50;
          return (
            <div
              key={index}
              className="flex-1 bg-primary/20 rounded-t-sm relative group"
              style={{ height: `${height}%`, backgroundColor: `${color}40` }}
            >
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {(point[metric] * 100).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const AlgorithmComparison = ({ algorithms }) => (
    <div className="space-y-4">
      {Object.entries(algorithms).map(([name, data]) => (
        <div key={name} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium capitalize">{name} Filtering</span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{data.accuracy}% accuracy</span>
              <span>{data.usage}% usage</span>
              <span>{data.avgResponseTime}ms</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${data.accuracy}%` }}
              />
            </div>
            <div className="bg-muted rounded-full h-2">
              <div
                className="bg-success h-2 rounded-full"
                style={{ width: `${data.usage}%` }}
              />
            </div>
            <div className="bg-muted rounded-full h-2">
              <div
                className="bg-warning h-2 rounded-full"
                style={{ width: `${Math.min(data.avgResponseTime / 2, 100)}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const SystemHealthIndicator = ({ value, label, threshold = 0.8 }) => {
    const getHealthColor = () => {
      if (value >= threshold) return 'success';
      if (value >= threshold * 0.7) return 'warning';
      return 'destructive';
    };

    const getHealthIcon = () => {
      if (value >= threshold) return 'CheckCircle';
      if (value >= threshold * 0.7) return 'AlertTriangle';
      return 'XCircle';
    };

    return (
      <div className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name={getHealthIcon()} size={16} className={`text-${getHealthColor()}`} />
          <span className="font-medium">{label}</span>
        </div>
        <span className={`font-bold text-${getHealthColor()}`}>
          {typeof value === 'number' && value < 1 
            ? `${(value * 100).toFixed(1)}%`
            : value}
        </span>
      </div>
    );
  };

  const RecommendationHeatmap = ({ data }) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    // Demo heatmap data
    const heatmapData = days.map(day => 
      hours.map(hour => ({
        day,
        hour,
        intensity: Math.random() * 0.8 + 0.2
      }))
    );

    return (
      <div className="space-y-2">
        <div className="grid gap-0.5 text-xs" style={{gridTemplateColumns: 'auto repeat(24, 1fr)'}}>
          <div></div>
          {hours.filter((_, i) => i % 2 === 0).map(hour => (
            <div key={hour} className="text-center text-muted-foreground" style={{gridColumn: `span 2`}}>
              {hour}
            </div>
          ))}
        </div>
        {heatmapData.map((dayData, dayIndex) => (
          <div key={dayIndex} className="grid gap-0.5" style={{gridTemplateColumns: 'auto repeat(24, 1fr)'}}>
            <div className="text-xs text-muted-foreground text-right pr-2 py-1">
              {days[dayIndex]}
            </div>
            {dayData.map((cell, hourIndex) => (
              <div
                key={hourIndex}
                className="h-3 rounded-sm"
                style={{
                  backgroundColor: `rgba(59, 130, 246, ${cell.intensity})`,
                }}
                title={`${cell.day} ${cell.hour}:00 - ${Math.round(cell.intensity * 100)}% activity`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={48} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">
            System Metrics
          </h2>
          <p className="text-muted-foreground">
            Performance analytics and evaluation metrics for the recommendation system
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 border border-border rounded text-sm bg-background"
          >
            <option value="1day">Last 24 hours</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          
          <select
            value={selectedMetricType}
            onChange={(e) => setSelectedMetricType(e.target.value)}
            className="px-3 py-1 border border-border rounded text-sm bg-background"
          >
            <option value="all">All Metrics</option>
            <option value="accuracy">Accuracy</option>
            <option value="performance">Performance</option>
            <option value="system">System Health</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Recommendations"
          value={metrics?.overview?.totalRecommendations}
          icon="Target"
          trend={2.3}
        />
        <MetricCard
          title="Success Rate"
          value={metrics?.overview?.accuracy}
          icon="CheckCircle"
          color="success"
          trend={1.2}
        />
        <MetricCard
          title="User Satisfaction"
          value={metrics?.overview?.userSatisfaction}
          icon="Heart"
          color="primary"
          trend={0.8}
        />
        <MetricCard
          title="Avg Response Time"
          value={metrics?.system?.avgResponseTime}
          unit="ms"
          icon="Clock"
          color="warning"
          trend={-1.5}
        />
        <MetricCard
          title="System Uptime"
          value={metrics?.overview?.systemUptime}
          icon="Server"
          color="success"
          trend={0.1}
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Metrics */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Icon name="Brain" size={18} />
            <span>ML Performance Metrics</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              title="RMSE"
              value={metrics?.performance?.rmse?.toFixed(3)}
              icon="Target"
              color="primary"
            />
            <MetricCard
              title="MAE"
              value={metrics?.performance?.mae?.toFixed(3)}
              icon="TrendingDown"
              color="primary"
            />
            <MetricCard
              title="Precision"
              value={metrics?.performance?.precision}
              icon="CheckCircle"
              color="success"
            />
            <MetricCard
              title="Recall"
              value={metrics?.performance?.recall}
              icon="Search"
              color="success"
            />
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">F1-Score</span>
              <span className="text-lg font-bold">
                {(metrics?.performance?.f1Score * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${metrics?.performance?.f1Score * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Algorithm Comparison */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Icon name="BarChart3" size={18} />
            <span>Algorithm Performance</span>
          </h3>
          <AlgorithmComparison algorithms={metrics?.algorithms || {}} />
        </div>
      </div>

      {/* Historical Trends */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Icon name="TrendingUp" size={18} />
          <span>Performance Trends</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium text-sm mb-2">Accuracy Trend</h4>
            <PerformanceChart data={historicalData} metric="accuracy" color="#22c55e" />
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Precision Trend</h4>
            <PerformanceChart data={historicalData} metric="precision" color="#3b82f6" />
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Recall Trend</h4>
            <PerformanceChart data={historicalData} metric="recall" color="#f59e0b" />
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">RMSE Trend</h4>
            <PerformanceChart data={historicalData} metric="rmse" color="#ef4444" />
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Icon name="Activity" size={18} />
            <span>System Health</span>
          </h3>
          
          <div className="space-y-3">
            <SystemHealthIndicator
              value={metrics?.system?.cpuUsage / 100}
              label="CPU Usage"
              threshold={0.7}
            />
            <SystemHealthIndicator
              value={metrics?.system?.memoryUsage / 100}
              label="Memory Usage"
              threshold={0.8}
            />
            <SystemHealthIndicator
              value={metrics?.system?.cacheHitRate}
              label="Cache Hit Rate"
              threshold={0.9}
            />
            <SystemHealthIndicator
              value={metrics?.system?.dataFreshness}
              label="Data Freshness"
              threshold={0.9}
            />
          </div>
        </div>

        {/* User Behavior */}
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Icon name="Users" size={18} />
            <span>User Engagement</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Click-through Rate"
              value={metrics?.userBehavior?.clickThroughRate}
              icon="MousePointer"
              color="primary"
            />
            <MetricCard
              title="Conversion Rate"
              value={metrics?.userBehavior?.conversionRate}
              icon="Target"
              color="success"
            />
            <MetricCard
              title="Avg Session Time"
              value={metrics?.userBehavior?.averageSessionTime}
              unit="min"
              icon="Clock"
              color="warning"
            />
            <MetricCard
              title="Bounce Rate"
              value={metrics?.userBehavior?.bounceRate}
              icon="ArrowLeft"
              color="destructive"
            />
          </div>
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Icon name="Calendar" size={18} />
          <span>Recommendation Activity Heatmap</span>
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Shows when users are most active with recommendations (by day and hour)
        </p>
        <RecommendationHeatmap />
        
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less Active</span>
          <div className="flex items-center space-x-1">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
              <div
                key={intensity}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: `rgba(59, 130, 246, ${intensity})` }}
              />
            ))}
          </div>
          <span>More Active</span>
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;
