import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';
import SearchFilters from './components/SearchFilters';
import SortControls from './components/SortControls';

import SearchSuggestions from './components/SearchSuggestions';
import ResultsGrid from './components/ResultsGrid';
import Pagination from './components/Pagination';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  // Filter and sort states
  const [filters, setFilters] = useState({
    genre: '',
    rating: '',
    year: '',
    minRating: '',
    maxRating: ''
  });
  
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(12);

  // Mock movie data
  const mockMovies = [
    {
      id: 1,
      title: "The Dark Knight",
      poster: "https://images.unsplash.com/photo-1489599735734-79b4d2fea9a2?w=400&h=600&fit=crop",
      rating: 9.0,
      year: 2008,
      genre: "Action, Crime, Drama",
      duration: "152 min",
      votes: "2.8M",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
      isInWatchlist: false,
      userRating: 0
    },
    {
      id: 2,
      title: "Inception",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
      rating: 8.8,
      year: 2010,
      genre: "Action, Sci-Fi, Thriller",
      duration: "148 min",
      votes: "2.4M",
      description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      isInWatchlist: true,
      userRating: 5
    },
    {
      id: 3,
      title: "Interstellar",
      poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=600&fit=crop",
      rating: 8.6,
      year: 2014,
      genre: "Adventure, Drama, Sci-Fi",
      duration: "169 min",
      votes: "1.9M",
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.",
      isInWatchlist: false,
      userRating: 4
    },
    {
      id: 4,
      title: "The Matrix",
      poster: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
      rating: 8.7,
      year: 1999,
      genre: "Action, Sci-Fi",
      duration: "136 min",
      votes: "2.0M",
      description: "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
      isInWatchlist: true,
      userRating: 5
    },
    {
      id: 5,
      title: "Pulp Fiction",
      poster: "https://images.unsplash.com/photo-1489599735734-79b4d2fea9a2?w=400&h=600&fit=crop",
      rating: 8.9,
      year: 1994,
      genre: "Crime, Drama",
      duration: "154 min",
      votes: "2.1M",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
      isInWatchlist: false,
      userRating: 0
    },
    {
      id: 6,
      title: "The Godfather",
      poster: "https://images.unsplash.com/photo-1489599735734-79b4d2fea9a2?w=400&h=600&fit=crop",
      rating: 9.2,
      year: 1972,
      genre: "Crime, Drama",
      duration: "175 min",
      votes: "1.9M",
      description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      isInWatchlist: true,
      userRating: 5
    },
    {
      id: 7,
      title: "Forrest Gump",
      poster: "https://images.unsplash.com/photo-1489599735734-79b4d2fea9a2?w=400&h=600&fit=crop",
      rating: 8.8,
      year: 1994,
      genre: "Drama, Romance",
      duration: "142 min",
      votes: "2.2M",
      description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
      isInWatchlist: false,
      userRating: 4
    },
    {
      id: 8,
      title: "The Shawshank Redemption",
      poster: "https://images.unsplash.com/photo-1489599735734-79b4d2fea9a2?w=400&h=600&fit=crop",
      rating: 9.3,
      year: 1994,
      genre: "Drama",
      duration: "142 min",
      votes: "2.8M",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      isInWatchlist: true,
      userRating: 5
    }
  ];

  const [filteredMovies, setFilteredMovies] = useState(mockMovies);
  const [totalResults, setTotalResults] = useState(mockMovies?.length);

  // Filter and sort movies
  useEffect(() => {
    let filtered = [...mockMovies];

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered?.filter(movie =>
        movie?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        movie?.genre?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        movie?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.genre) {
      filtered = filtered?.filter(movie =>
        movie?.genre?.toLowerCase()?.includes(filters?.genre?.toLowerCase())
      );
    }

    if (filters?.rating) {
      const minRating = parseFloat(filters?.rating?.replace('+', ''));
      filtered = filtered?.filter(movie => movie?.rating >= minRating);
    }

    if (filters?.year) {
      if (filters?.year === '2010s') {
        filtered = filtered?.filter(movie => movie?.year >= 2010 && movie?.year <= 2019);
      } else if (filters?.year === '2000s') {
        filtered = filtered?.filter(movie => movie?.year >= 2000 && movie?.year <= 2009);
      } else if (filters?.year === '1990s') {
        filtered = filtered?.filter(movie => movie?.year >= 1990 && movie?.year <= 1999);
      } else if (filters?.year === 'older') {
        filtered = filtered?.filter(movie => movie?.year < 1990);
      } else {
        filtered = filtered?.filter(movie => movie?.year?.toString() === filters?.year);
      }
    }

    if (filters?.minRating) {
      filtered = filtered?.filter(movie => movie?.rating >= parseFloat(filters?.minRating));
    }

    if (filters?.maxRating) {
      filtered = filtered?.filter(movie => movie?.rating <= parseFloat(filters?.maxRating));
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a?.title?.localeCompare(b?.title);
          break;
        case 'rating':
          comparison = a?.rating - b?.rating;
          break;
        case 'year':
          comparison = a?.year - b?.year;
          break;
        case 'popularity':
          comparison = parseFloat(a?.votes?.replace('M', '')) - parseFloat(b?.votes?.replace('M', ''));
          break;
        default: // relevance
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredMovies(filtered);
    setTotalResults(filtered?.length);
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy, sortOrder]);

  // Handle search
  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      setSearchParams({ q: searchQuery?.trim() });
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setSearchParams({ q: suggestion });
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      genre: '',
      rating: '',
      year: '',
      minRating: '',
      maxRating: ''
    });
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get paginated results
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedMovies = filteredMovies?.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Movies'}
                </h1>
                {searchQuery && (
                  <p className="text-muted-foreground">
                    Found {totalResults} {totalResults === 1 ? 'movie' : 'movies'}
                  </p>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={() => navigate('/movie-browse')}
                className="flex items-center space-x-2"
              >
                <Icon name="ArrowLeft" size={16} />
                <span>Back to Browse</span>
              </Button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="flex-1">
                <Input
                  type="search"
                  placeholder="Search for movies, genres, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="flex items-center space-x-2">
                <Icon name="Search" size={16} />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </form>
          </div>

          {/* Show suggestions if no search query or no results */}
          {(!searchQuery || totalResults === 0) && (
            <div className="mb-8">
              <SearchSuggestions
                query={searchQuery}
                onSuggestionClick={handleSuggestionClick}
                onClearSearch={handleClearSearch}
              />
            </div>
          )}

          {/* Filters and Results */}
          {searchQuery && totalResults > 0 && (
            <>
              {/* Filters */}
              <div className="mb-6">
                <SearchFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                  isExpanded={isFiltersExpanded}
                  onToggleExpanded={() => setIsFiltersExpanded(!isFiltersExpanded)}
                />
              </div>

              {/* Sort Controls */}
              <div className="mb-6">
                <SortControls
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>

              {/* Results Grid */}
              <div className="mb-8">
                <ResultsGrid
                  movies={paginatedMovies}
                  viewMode={viewMode}
                  isLoading={isLoading}
                />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  resultsPerPage={resultsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;