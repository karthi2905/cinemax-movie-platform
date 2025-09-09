import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const SimilarMovies = ({ recommendationService }) => {
  const [selectedMovieId, setSelectedMovieId] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [similarityMethod, setSimilarityMethod] = useState('content');
  const [maxResults, setMaxResults] = useState(8);
  const [showMetrics, setShowMetrics] = useState(false);
  const [popularMovies] = useState([
    { id: '1', title: 'The Shawshank Redemption', genre: 'Drama', year: '1994' },
    { id: '2', title: 'The Godfather', genre: 'Crime', year: '1972' },
    { id: '3', title: 'The Dark Knight', genre: 'Action', year: '2008' },
    { id: '1218', title: 'Magma: Volcanic Disaster', genre: 'Action', year: '2006' },
    { id: '1129', title: 'Ju-on', genre: 'Horror', year: '2002' }
  ]);

  useEffect(() => {
    if (selectedMovieId) {
      const movie = popularMovies.find(m => m.id === selectedMovieId);
      setSelectedMovie(movie);
    } else {
      setSelectedMovie(null);
    }
  }, [selectedMovieId, popularMovies]);

  const findSimilarMovies = async () => {
    if (!selectedMovieId) return;

    setIsLoading(true);
    try {
      const result = await recommendationService.findSimilarMovies(
        selectedMovieId, 
        {
          method: similarityMethod,
          limit: maxResults,
          includeMetrics: showMetrics
        }
      );
      setSimilarMovies(result.movies || []);
    } catch (error) {
      console.error('Similar movies error:', error);
      setSimilarMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const SimilarityMethodCard = ({ method, title, description, icon, isActive, onClick }) => (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isActive 
          ? 'border-primary bg-primary/5 ring-1 ring-primary/20' 
          : 'border-border bg-card hover:border-primary/40'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <Icon name={icon} size={20} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
        <div className="flex-1">
          <h4 className={`font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        </div>
        {isActive && (
          <Icon name="Check" size={16} className="text-primary" />
        )}
      </div>
    </div>
  );

  const MovieCard = ({ movie, similarity }) => (
    <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Movie Image */}
      <div className="relative h-64 bg-muted">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name="Film" size={32} className="text-muted-foreground" />
          </div>
        )}
        
        {/* Similarity Score Badge */}
        {similarity && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            {(similarity * 100).toFixed(1)}% match
          </div>
        )}
      </div>

      {/* Movie Details */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-sm line-clamp-2">
          {movie.title}
        </h3>
        
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          {movie.year && (
            <span>{movie.year}</span>
          )}
          {movie.genre && (
            <>
              <span>•</span>
              <span>{movie.genre}</span>
            </>
          )}
          {movie.rating && (
            <>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-yellow-500" />
                <span>{movie.rating.toFixed(1)}</span>
              </div>
            </>
          )}
        </div>

        {movie.synopsis && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {movie.synopsis}
          </p>
        )}

        {/* Similarity Details */}
        {similarity && showMetrics && (
          <div className="pt-2 border-t space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Content Similarity:</span>
              <span className="font-medium">{(similarity * 100).toFixed(1)}%</span>
            </div>
            {movie.genreSimilarity && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Genre Match:</span>
                <span className="font-medium">{(movie.genreSimilarity * 100).toFixed(1)}%</span>
              </div>
            )}
            {movie.ratingDifference !== undefined && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rating Diff:</span>
                <span className="font-medium">±{movie.ratingDifference.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const SimilarityInsights = ({ insights }) => (
    <div className="bg-card border rounded-lg p-4">
      <h3 className="font-semibold mb-3 flex items-center space-x-2">
        <Icon name="Lightbulb" size={16} />
        <span>Similarity Insights</span>
      </h3>
      <div className="space-y-2">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-2">
            <Icon name="ChevronRight" size={14} className="text-primary mt-0.5" />
            <p className="text-sm text-foreground">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Similar Movies
        </h2>
        <p className="text-muted-foreground">
          Find movies similar to your favorites using AI-powered similarity algorithms
        </p>
      </div>

      {/* Movie Selection */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Icon name="Search" size={18} />
          <span>Select Movie</span>
        </h3>
        
        <div className="space-y-4">
          <select
            value={selectedMovieId}
            onChange={(e) => setSelectedMovieId(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="">Choose a movie to find similar ones...</option>
            {popularMovies.map(movie => (
              <option key={movie.id} value={movie.id}>
                {movie.title} ({movie.year}) - {movie.genre}
              </option>
            ))}
          </select>

          {selectedMovie && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Film" size={20} className="text-primary" />
                <div>
                  <h4 className="font-medium">{selectedMovie.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMovie.year} • {selectedMovie.genre}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similarity Method Selection */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold mb-4 flex items-center space-x-2">
          <Icon name="Settings" size={18} />
          <span>Similarity Method</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <SimilarityMethodCard
            method="content"
            title="Content-Based"
            description="Based on movie features like genre, cast, and plot"
            icon="FileText"
            isActive={similarityMethod === 'content'}
            onClick={() => setSimilarityMethod('content')}
          />
          <SimilarityMethodCard
            method="collaborative"
            title="Collaborative"
            description="Based on user ratings and preferences"
            icon="Users"
            isActive={similarityMethod === 'collaborative'}
            onClick={() => setSimilarityMethod('collaborative')}
          />
          <SimilarityMethodCard
            method="hybrid"
            title="Hybrid"
            description="Combines content and collaborative filtering"
            icon="Zap"
            isActive={similarityMethod === 'hybrid'}
            onClick={() => setSimilarityMethod('hybrid')}
          />
        </div>

        {/* Additional Options */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Max Results:</label>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="px-2 py-1 border border-border rounded text-sm bg-background"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showMetrics}
              onChange={(e) => setShowMetrics(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Show similarity metrics</span>
          </label>
        </div>
      </div>

      {/* Find Similar Button */}
      {selectedMovieId && (
        <div className="text-center">
          <button
            onClick={findSimilarMovies}
            disabled={isLoading}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span>Finding Similar Movies...</span>
              </>
            ) : (
              <>
                <Icon name="Search" size={16} />
                <span>Find Similar Movies</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            Analyzing movie similarity using {similarityMethod} filtering...
          </p>
        </div>
      )}

      {/* Similar Movies Results */}
      {!isLoading && similarMovies.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Movies Similar to "{selectedMovie?.title}"
            </h3>
            <div className="text-sm text-muted-foreground">
              {similarMovies.length} results found using {similarityMethod} similarity
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {similarMovies.map((movie, index) => (
              <MovieCard 
                key={movie.id || index} 
                movie={movie} 
                similarity={movie.similarity}
              />
            ))}
          </div>

          {/* Similarity Insights */}
          {similarMovies[0]?.insights && (
            <SimilarityInsights insights={similarMovies[0].insights} />
          )}
        </div>
      )}

      {/* No Results */}
      {!isLoading && selectedMovieId && similarMovies.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No similar movies found. Try a different similarity method or movie.
          </p>
        </div>
      )}

      {/* Feature Explanation */}
      {!selectedMovieId && (
        <div className="bg-card border rounded-lg p-6">
          <h3 className="font-semibold mb-4 flex items-center space-x-2">
            <Icon name="Info" size={18} />
            <span>How Movie Similarity Works</span>
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={16} className="text-primary" />
                  <h4 className="font-medium">Content-Based</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Analyzes movie attributes like genre, director, cast, plot keywords, and runtime to find movies with similar characteristics.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-primary" />
                  <h4 className="font-medium">Collaborative</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Uses user ratings and viewing patterns to find movies liked by users with similar tastes to yours.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-primary" />
                  <h4 className="font-medium">Hybrid</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Combines both approaches for more accurate and diverse recommendations that consider both content and user preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimilarMovies;
