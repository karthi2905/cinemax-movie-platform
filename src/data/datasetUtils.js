// Genre Classification Dataset Utilities
// Functions to parse and work with the movie dataset

// Parse training data from the dataset
export const parseTrainingData = (fileContent) => {
  if (!fileContent) return [];
  
  const lines = fileContent.split('\n');
  const movies = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    try {
      // Format: ID ::: TITLE ::: GENRE ::: DESCRIPTION
      const parts = line.split(' ::: ');
      if (parts.length >= 4) {
        const [id, title, genre, description] = parts;
        
        movies.push({
          id: id.trim(),
          title: title.trim(),
          genre: genre.trim().toLowerCase(),
          description: description.trim(),
          source: 'dataset'
        });
      }
    } catch (error) {
      console.warn(`Error parsing line ${index + 1}:`, error);
    }
  });
  
  return movies;
};

// Parse test data from the dataset
export const parseTestData = (fileContent) => {
  if (!fileContent) return [];
  
  const lines = fileContent.split('\n');
  const movies = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    try {
      // Format: ID ::: TITLE ::: DESCRIPTION
      const parts = line.split(' ::: ');
      if (parts.length >= 3) {
        const [id, title, description] = parts;
        
        movies.push({
          id: id.trim(),
          title: title.trim(),
          description: description.trim(),
          genre: null, // No genre in test data
          source: 'dataset'
        });
      }
    } catch (error) {
      console.warn(`Error parsing line ${index + 1}:`, error);
    }
  });
  
  return movies;
};

// Get unique genres from the dataset
export const getDatasetGenres = (movies) => {
  const genres = new Set();
  movies.forEach(movie => {
    if (movie.genre && movie.genre !== 'null') {
      genres.add(movie.genre);
    }
  });
  return Array.from(genres).sort();
};

// Convert dataset movies to match existing movie format
export const convertDatasetToMovieFormat = (datasetMovies) => {
  return datasetMovies.map((movie, index) => {
    const releaseYear = extractYearFromTitle(movie.title) || Math.floor(Math.random() * (2024 - 1950) + 1950);
    
    return {
      id: `dataset_${movie.id}`,
      title: cleanTitle(movie.title),
      releaseYear: releaseYear,
      releaseDate: `January 1, ${releaseYear}`,
      runtime: Math.floor(Math.random() * (180 - 90) + 90), // Random runtime 90-180 mins
      certification: getRandomCertification(),
      language: "English",
      budget: "N/A",
      boxOffice: "N/A",
      genres: [capitalizeGenre(movie.genre)],
      averageRating: (Math.random() * 4 + 6).toFixed(1), // Random rating 6.0-10.0
      totalRatings: Math.floor(Math.random() * 100000) + 1000,
      popularity: Math.floor(Math.random() * 100) + 1,
      posterImage: getRandomPosterImage(),
      backdropImage: getRandomBackdropImage(),
      synopsis: movie.description,
      director: { 
        name: "Unknown Director", 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
      },
      cast: [
        { 
          name: "Actor 1", 
          character: "Main Character", 
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" 
        },
        { 
          name: "Actor 2", 
          character: "Supporting Role", 
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
        }
      ],
      productionCompanies: ["Unknown Studio"],
      ratingDistribution: generateRandomRatingDistribution(),
      source: 'dataset'
    };
  });
};

// Helper function to extract year from movie title
const extractYearFromTitle = (title) => {
  const yearMatch = title.match(/\((\d{4})\)/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
};

// Helper function to clean movie title (remove year)
const cleanTitle = (title) => {
  return title.replace(/\(\d{4}(?:\/[IV]+)?\)/, '').trim();
};

// Helper function to capitalize genre
const capitalizeGenre = (genre) => {
  if (!genre) return 'Unknown';
  return genre.charAt(0).toUpperCase() + genre.slice(1);
};

// Helper function to get random certification
const getRandomCertification = () => {
  const certifications = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  return certifications[Math.floor(Math.random() * certifications.length)];
};

// Helper function to get random poster image
const getRandomPosterImage = () => {
  const posterIds = [
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1440404653325-ab127d49abc1',
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1518676590629-3dcbd9c5a5c9',
    'photo-1506905925346-21bda4d32df4'
  ];
  const randomId = posterIds[Math.floor(Math.random() * posterIds.length)];
  return `https://images.unsplash.com/${randomId}?w=300&h=450&fit=crop`;
};

// Helper function to get random backdrop image
const getRandomBackdropImage = () => {
  const backdropIds = [
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1440404653325-ab127d49abc1',
    'photo-1518676590629-3dcbd9c5a5c9',
    'photo-1506905925346-21bda4d32df4',
    'photo-1574375927938-d5a98e8ffe85'
  ];
  const randomId = backdropIds[Math.floor(Math.random() * backdropIds.length)];
  return `https://images.unsplash.com/${randomId}?w=1280&h=720&fit=crop`;
};

// Helper function to generate random rating distribution
const generateRandomRatingDistribution = () => {
  const total = 100;
  let remaining = total;
  const distribution = [];
  
  for (let stars = 5; stars >= 1; stars--) {
    if (stars === 1) {
      distribution.push({ stars, percentage: remaining });
    } else {
      const percentage = Math.floor(Math.random() * remaining * 0.6);
      distribution.push({ stars, percentage });
      remaining -= percentage;
    }
  }
  
  return distribution.reverse();
};

// Search movies by description/synopsis
export const searchMoviesByDescription = (movies, query) => {
  if (!query || query.trim() === '') return movies;
  
  const searchTerm = query.toLowerCase().trim();
  return movies.filter(movie => 
    movie.description?.toLowerCase().includes(searchTerm) ||
    movie.synopsis?.toLowerCase().includes(searchTerm) ||
    movie.title.toLowerCase().includes(searchTerm)
  );
};

// Filter movies by genre from dataset
export const filterMoviesByDatasetGenre = (movies, genre) => {
  if (!genre) return movies;
  return movies.filter(movie => 
    movie.genre?.toLowerCase() === genre.toLowerCase() ||
    movie.genres?.some(g => g.toLowerCase() === genre.toLowerCase())
  );
};

// Get genre statistics
export const getGenreStatistics = (movies) => {
  const genreCount = {};
  
  movies.forEach(movie => {
    if (movie.genre && movie.genre !== 'null') {
      genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
    }
    if (movie.genres) {
      movie.genres.forEach(genre => {
        const lowerGenre = genre.toLowerCase();
        genreCount[lowerGenre] = (genreCount[lowerGenre] || 0) + 1;
      });
    }
  });
  
  return Object.entries(genreCount)
    .map(([genre, count]) => ({ genre: capitalizeGenre(genre), count }))
    .sort((a, b) => b.count - a.count);
};

// Load dataset files (for use in components)
export const loadDatasetFile = async (filename) => {
  try {
    const response = await fetch(`/src/data/${filename}`);
    if (!response.ok) throw new Error(`Failed to load ${filename}`);
    return await response.text();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
};
