import React, { useState, useEffect } from 'react';
import { useMovieDataset } from '../../hooks/useMovieDataset';
import { Search, Filter, BarChart3, Eye, PlayCircle } from 'lucide-react';

const DatasetExplorer = () => {
  const {
    trainingData,
    testData,
    genres,
    genreStats,
    loading,
    error,
    usingFullDataset,
    loadFullDataset,
    searchDataset,
    filterByGenre,
    predictGenre,
    getMoviesInStandardFormat
  } = useMovieDataset();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [activeTab, setActiveTab] = useState('training');
  const [searchResults, setSearchResults] = useState({ trainingResults: [], testResults: [] });
  const [filteredMovies, setFilteredMovies] = useState([]);

  // Update search results when query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchResults(searchDataset(searchQuery));
    } else {
      setSearchResults({ trainingResults: trainingData, testResults: testData });
    }
  }, [searchQuery, trainingData, testData, searchDataset]);

  // Update filtered movies when genre changes
  useEffect(() => {
    if (selectedGenre) {
      setFilteredMovies(filterByGenre(selectedGenre));
    } else {
      setFilteredMovies(trainingData);
    }
  }, [selectedGenre, trainingData, filterByGenre]);

  const displayData = searchQuery 
    ? (activeTab === 'training' ? searchResults.trainingResults : searchResults.testResults)
    : (selectedGenre 
      ? filteredMovies 
      : (activeTab === 'training' ? trainingData : testData));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading movie dataset...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-600 text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Dataset</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Movie Genre Dataset Explorer</h1>
                <p className="text-gray-600">
                  Explore the Genre Classification Dataset with {trainingData.length} labeled movies
                  {!usingFullDataset && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Sample Data
                    </span>
                  )}
                  {usingFullDataset && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Full Dataset
                    </span>
                  )}
                </p>
              </div>
              {!usingFullDataset && (
                <button
                  onClick={loadFullDataset}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {loading ? 'Loading...' : 'Load Full Dataset'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <PlayCircle className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Training Movies</p>
                <p className="text-2xl font-bold text-gray-900">{trainingData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Test Movies</p>
                <p className="text-2xl font-bold text-gray-900">{testData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Genres</p>
                <p className="text-2xl font-bold text-gray-900">{genres.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Genre Filter */}
            <div className="md:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre.charAt(0).toUpperCase() + genre.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('training')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'training'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Training Data ({searchQuery ? searchResults.trainingResults.length : filteredMovies.length})
              </button>
              <button
                onClick={() => setActiveTab('test')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'test'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Test Data ({searchQuery ? searchResults.testResults.length : testData.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Genre Statistics */}
        {activeTab === 'training' && genreStats.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Genre Distribution</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {genreStats.map(({ genre, count }) => (
                <div key={genre} className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 capitalize">{genre}</p>
                  <p className="text-2xl font-bold text-blue-600">{count}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Movie Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayData.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              showGenrePrediction={activeTab === 'test'}
              predictGenre={predictGenre}
            />
          ))}
        </div>

        {displayData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No movies found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Movie Card Component
const MovieCard = ({ movie, showGenrePrediction, predictGenre }) => {
  const [predictedGenre, setPredictedGenre] = useState(null);

  useEffect(() => {
    if (showGenrePrediction && movie.description) {
      setPredictedGenre(predictGenre(movie.description));
    }
  }, [showGenrePrediction, movie.description, predictGenre]);

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        {/* Genre Badge */}
        <div className="mb-3">
          {movie.genre ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {movie.genre}
            </span>
          ) : showGenrePrediction && predictedGenre ? (
            <div className="space-y-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 capitalize">
                Predicted: {predictedGenre}
              </span>
            </div>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              Unknown Genre
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-4 mb-4">
          {movie.description}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>ID: {movie.id}</span>
          <span className="capitalize">{movie.source} data</span>
        </div>
      </div>
    </div>
  );
};

export default DatasetExplorer;
