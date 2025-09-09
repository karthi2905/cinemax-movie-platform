import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Database, Eye, TrendingUp, PlayCircle, PieChart } from 'lucide-react';
import { useMovieDataset } from '../hooks/useMovieDataset';

const DatasetLanding = () => {
  const { 
    trainingData, 
    testData, 
    genres, 
    genreStats, 
    loading, 
    usingFullDataset,
    loadFullDataset 
  } = useMovieDataset();

  const features = [
    {
      icon: <Eye className="h-8 w-8 text-blue-600" />,
      title: "Explore Dataset",
      description: "Browse through the movie collection, search by title or description, and filter by genre.",
      link: "/dataset/explore",
      buttonText: "Start Exploring",
              stats: loading ? "Loading..." : `${trainingData.length + testData.length} movies${!usingFullDataset ? ' (sample)' : ''}`
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Genre Statistics",
      description: "View detailed analytics and visualizations of genre distribution in the dataset.",
      link: "/dataset/stats", 
      buttonText: "View Statistics",
      stats: loading ? "Loading..." : `${genres.length} genres`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 text-center">
            <Database className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Movie Genre Dataset</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
              Explore a comprehensive movie dataset perfect for genre classification tasks. 
              Browse movies, analyze genre distributions, and discover insights.
            </p>
            {!usingFullDataset && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm">
                  <strong>Currently showing sample data</strong> (1,000 training + 100 test movies).
                  The full dataset contains <strong>54,214 training</strong> and <strong>54,200 test</strong> movies.
                </p>
                <button
                  onClick={loadFullDataset}
                  disabled={loading}
                  className="mt-2 inline-flex items-center px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load Full Dataset (108k+ movies)'}
                </button>
              </div>
            )}
            {usingFullDataset && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-green-800 text-sm">
                  ✅ <strong>Full dataset loaded!</strong> You're now browsing all {trainingData.length + testData.length} movies.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <PlayCircle className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Training Movies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : trainingData.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Test Movies</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : testData.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Genres</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : genres.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Most Popular</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {loading ? '...' : (genreStats[0]?.genre || 'N/A')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-8">
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold text-gray-900 ml-3">{feature.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <Link
                    to={feature.link}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                  >
                    {feature.buttonText}
                  </Link>
                  
                  <span className="text-sm text-gray-500 font-medium">
                    {feature.stats}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dataset Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">About the Dataset</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dataset Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Labeled Training Data:</strong> Movies with confirmed genres for machine learning training</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Test Data:</strong> Movies without genre labels for prediction testing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Rich Descriptions:</strong> Detailed plot summaries for each movie</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Multiple Genres:</strong> Wide variety of movie genres and categories</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Use Cases</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Genre Classification:</strong> Train ML models to predict movie genres</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Text Analysis:</strong> Natural language processing on movie descriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Data Exploration:</strong> Analyze patterns and trends in movie data</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span><strong>Recommendation Systems:</strong> Build content-based recommendation engines</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Get Started</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dataset/explore"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
            >
              <Eye className="h-5 w-5 mr-2" />
              Explore Movies
            </Link>
            
            <Link
              to="/dataset/stats"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetLanding;
