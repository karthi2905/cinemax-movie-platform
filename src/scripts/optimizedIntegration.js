const fs = require('fs');
const path = require('path');

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'data');
const TRAIN_DATA_FILE = path.join(DATA_DIR, 'train_data.txt');
const TEST_DATA_FILE = path.join(DATA_DIR, 'test_data.txt');
const MOVIES_FILE = path.join(DATA_DIR, 'movies.js');
const MOVIES_BACKUP = path.join(DATA_DIR, 'movies_original_backup.js');

// Configuration for optimized integration
const MAX_MOVIES_TO_ADD = 2000; // Much more manageable number
const SAMPLE_RATIO = 0.02; // Sample 2% of the dataset

// Utility functions (same as before but optimized)
const extractYearFromTitle = (title) => {
  const yearMatch = title.match(/\((\d{4})\)/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
};

const cleanTitle = (title) => {
  return title.replace(/\(\d{4}(?:\/[IV]+)?\)/, '').trim();
};

const capitalizeGenre = (genre) => {
  if (!genre || genre === 'null') return 'Unknown';
  
  const genreMap = {
    'sci-fi': 'Sci-Fi',
    'thriller': 'Thriller',
    'drama': 'Drama',
    'comedy': 'Comedy',
    'horror': 'Horror',
    'action': 'Action',
    'adventure': 'Adventure',
    'romance': 'Romance',
    'fantasy': 'Fantasy',
    'crime': 'Crime',
    'mystery': 'Mystery',
    'documentary': 'Documentary',
    'animation': 'Animation',
    'family': 'Family',
    'war': 'War',
    'western': 'Western',
    'biography': 'Biography',
    'history': 'History',
    'music': 'Music',
    'sport': 'Sport',
    'adult': 'Adult',
    'reality-tv': 'Reality-TV',
    'talk-show': 'Talk-Show',
    'short': 'Short'
  };
  
  const normalizedGenre = genre.toLowerCase().trim();
  return genreMap[normalizedGenre] || genre.charAt(0).toUpperCase() + genre.slice(1);
};

const getRandomCertification = () => {
  const certifications = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  return certifications[Math.floor(Math.random() * certifications.length)];
};

const getRandomPosterImage = () => {
  const moviePosters = [
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1440404653325-ab127d49abc1',
    'photo-1518676590629-3dcbd9c5a5c9',
    'photo-1506905925346-21bda4d32df4',
    'photo-1574375927938-d5a98e8ffe85'
  ];
  const randomId = moviePosters[Math.floor(Math.random() * moviePosters.length)];
  return `https://images.unsplash.com/${randomId}?w=500&h=750&fit=crop`;
};

const getRandomBackdropImage = () => {
  const backdrops = [
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1440404653325-ab127d49abc1',
    'photo-1518676590629-3dcbd9c5a5c9',
    'photo-1506905925346-21bda4d32df4',
    'photo-1574375927938-d5a98e8ffe85'
  ];
  const randomId = backdrops[Math.floor(Math.random() * backdrops.length)];
  return `https://images.unsplash.com/${randomId}?w=1280&h=720&fit=crop`;
};

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

const getRandomDirectorName = () => {
  const directors = [
    'Christopher Nolan', 'Steven Spielberg', 'Martin Scorsese', 'Quentin Tarantino',
    'David Fincher', 'Alfonso Cuarón', 'Denis Villeneuve', 'Jordan Peele',
    'Greta Gerwig', 'Rian Johnson', 'James Cameron', 'Tim Burton'
  ];
  return directors[Math.floor(Math.random() * directors.length)];
};

const getRandomActors = () => {
  const actors = [
    'Leonardo DiCaprio', 'Meryl Streep', 'Robert De Niro', 'Tom Hanks',
    'Scarlett Johansson', 'Morgan Freeman', 'Brad Pitt', 'Natalie Portman',
    'Christian Bale', 'Cate Blanchett', 'Matthew McConaughey', 'Amy Adams'
  ];
  
  const shuffled = actors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2).map((name, index) => ({
    name,
    character: index === 0 ? 'Main Character' : 'Supporting Role',
    image: `https://images.unsplash.com/photo-${index === 0 ? '1500648767791-00dcc994a43e' : '1472099645785-5658abf4ff4e'}?w=100&h=100&fit=crop`
  }));
};

// Optimized parsing with sampling
const parseAndSampleDataset = (fileContent, maxMovies, source) => {
  if (!fileContent) return [];
  
  const lines = fileContent.split('\n');
  const allMovies = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    try {
      const parts = line.split(' ::: ');
      if (parts.length >= 3) {
        let movie;
        if (source === 'train' && parts.length >= 4) {
          const [id, title, genre, description] = parts;
          movie = {
            id: id.trim(),
            title: title.trim(),
            genre: genre.trim().toLowerCase(),
            description: description.trim(),
            source: `dataset-${source}`
          };
        } else if (source === 'test' && parts.length >= 3) {
          const [id, title, description] = parts;
          movie = {
            id: id.trim(),
            title: title.trim(),
            description: description.trim(),
            genre: null,
            source: `dataset-${source}`
          };
        }
        
        if (movie) {
          allMovies.push(movie);
        }
      }
    } catch (error) {
      console.warn(`Error parsing ${source} line ${index + 1}:`, error);
    }
  });
  
  // Sample the movies to get a manageable number
  const sampleSize = Math.min(maxMovies, allMovies.length);
  const step = Math.floor(allMovies.length / sampleSize);
  const sampledMovies = [];
  
  for (let i = 0; i < allMovies.length && sampledMovies.length < sampleSize; i += step) {
    sampledMovies.push(allMovies[i]);
  }
  
  return sampledMovies;
};

// Convert to movie format (same as before)
const convertDatasetToMovieFormat = (datasetMovies, startingId = 1000) => {
  return datasetMovies.map((movie, index) => {
    const releaseYear = extractYearFromTitle(movie.title) || Math.floor(Math.random() * (2024 - 1950) + 1950);
    const cleanedTitle = cleanTitle(movie.title);
    const genre = capitalizeGenre(movie.genre);
    
    return {
      id: `${startingId + index}`,
      title: cleanedTitle,
      releaseYear: releaseYear,
      releaseDate: `January 1, ${releaseYear}`,
      runtime: Math.floor(Math.random() * (180 - 90) + 90),
      certification: getRandomCertification(),
      language: "English",
      budget: "N/A",
      boxOffice: "N/A",
      genres: movie.genre ? [genre] : ['Unknown'],
      averageRating: parseFloat((Math.random() * 4 + 6).toFixed(1)),
      totalRatings: Math.floor(Math.random() * 50000) + 1000,
      popularity: Math.floor(Math.random() * 100) + 1,
      posterImage: getRandomPosterImage(),
      backdropImage: getRandomBackdropImage(),
      synopsis: movie.description,
      director: { 
        name: getRandomDirectorName(), 
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
      },
      cast: getRandomActors(),
      productionCompanies: ["Independent Studios", "Dataset Films"],
      ratingDistribution: generateRandomRatingDistribution(),
      source: movie.source
    };
  });
};

// Reset to original movies file
function resetToOriginalMovies() {
  const originalTemplate = `const movies = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    releaseYear: 1994,
    releaseDate: "September 23, 1994",
    runtime: 142,
    certification: "R",
    language: "English",
    budget: "$25 million",
    boxOffice: "$73.3 million",
    genres: ["Drama"],
    averageRating: 9.3,
    totalRatings: 2567432,
    popularity: 95,
    posterImage: "https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflNmkJq5Q2rE2E.jpg",
    backdropImage: "https://image.tmdb.org/t/p/w1280/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    director: { name: "Frank Darabont", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    cast: [
      { name: "Tim Robbins", character: "Andy Dufresne", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" },
      { name: "Morgan Freeman", character: "Ellis Boyd 'Red' Redding", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" }
    ],
    productionCompanies: ["Columbia Pictures", "Castle Rock Entertainment"],
    ratingDistribution: [{ stars: 5, percentage: 84 }, { stars: 4, percentage: 12 }, { stars: 3, percentage: 3 }, { stars: 2, percentage: 1 }, { stars: 1, percentage: 0 }]
  },
  {
    id: "2",
    title: "The Godfather",
    releaseYear: 1972,
    releaseDate: "March 24, 1972",
    runtime: 175,
    certification: "R",
    language: "English",
    budget: "$6 million",
    boxOffice: "$245-286 million",
    genres: ["Crime", "Drama"],
    averageRating: 9.2,
    totalRatings: 1756432,
    popularity: 97,
    posterImage: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    backdropImage: "https://image.tmdb.org/t/p/w1280/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
    synopsis: "An aging patriarch of an organized crime dynasty transfers control of his empire to his reluctant son.",
    director: { name: "Francis Ford Coppola", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    cast: [
      { name: "Marlon Brando", character: "Vito Corleone", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" },
      { name: "Al Pacino", character: "Michael Francis Corleone Sr.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" }
    ],
    productionCompanies: ["Paramount Pictures", "Alfran Productions"],
    ratingDistribution: [{ stars: 5, percentage: 82 }, { stars: 4, percentage: 13 }, { stars: 3, percentage: 4 }, { stars: 2, percentage: 1 }, { stars: 1, percentage: 0 }]
  }
];

export const allMovies = [...movies];

// Genre collections for easy filtering
export const genreCollections = {
  action: allMovies.filter(movie => movie.genres.includes("Action")),
  sciFi: allMovies.filter(movie => movie.genres.includes("Sci-Fi")),
  horror: allMovies.filter(movie => movie.genres.includes("Horror")),
  drama: allMovies.filter(movie => movie.genres.includes("Drama")),
  comedy: allMovies.filter(movie => movie.genres.includes("Comedy")),
  thriller: allMovies.filter(movie => movie.genres.includes("Thriller")),
  animation: allMovies.filter(movie => movie.genres.includes("Animation")),
  adventure: allMovies.filter(movie => movie.genres.includes("Adventure")),
  romance: allMovies.filter(movie => movie.genres.includes("Romance")),
  fantasy: allMovies.filter(movie => movie.genres.includes("Fantasy")),
  war: allMovies.filter(movie => movie.genres.includes("War")),
  crime: allMovies.filter(movie => movie.genres.includes("Crime")),
  mystery: allMovies.filter(movie => movie.genres.includes("Mystery"))
};

// Popular collections
export const popularCollections = {
  trending: allMovies.filter(movie => movie.popularity > 85).sort((a, b) => b.popularity - a.popularity),
  topRated: allMovies.filter(movie => movie.averageRating > 8.0).sort((a, b) => b.averageRating - a.averageRating),
  recent: allMovies.filter(movie => movie.releaseYear >= 2018).sort((a, b) => b.releaseYear - a.releaseYear),
  classics: allMovies.filter(movie => movie.releaseYear < 2000 && movie.averageRating > 8.0),
  blockbusters: allMovies.filter(movie => parseFloat(movie.boxOffice.replace(/[\\$,million billion]/g, '')) > 200)
};

export default { movies: allMovies, genreCollections, popularCollections };
`;

  return originalTemplate;
}

// Main optimized integration function
async function optimizedIntegration() {
  try {
    console.log('🎬 Starting Optimized CineMax Dataset Integration...');
    console.log(`📊 Target: Add ${MAX_MOVIES_TO_ADD} carefully selected dataset movies`);
    
    // Reset to a clean movies file
    console.log('🔄 Resetting to original movies structure...');
    const cleanMoviesContent = resetToOriginalMovies();
    
    // Read dataset files
    console.log('📂 Reading dataset files...');
    const trainData = fs.readFileSync(TRAIN_DATA_FILE, 'utf8');
    const testData = fs.readFileSync(TEST_DATA_FILE, 'utf8');
    
    // Parse and sample dataset movies
    console.log('🔍 Parsing and sampling dataset movies...');
    const trainSampleSize = Math.floor(MAX_MOVIES_TO_ADD * 0.6); // 60% from training
    const testSampleSize = MAX_MOVIES_TO_ADD - trainSampleSize;   // 40% from test
    
    const trainingMovies = parseAndSampleDataset(trainData, trainSampleSize, 'train');
    const testMovies = parseAndSampleDataset(testData, testSampleSize, 'test');
    
    console.log(`📊 Sampled ${trainingMovies.length} training movies and ${testMovies.length} test movies`);
    
    // Combine and convert to CineMax format
    console.log('🔄 Converting to CineMax format...');
    const allDatasetMovies = [...trainingMovies, ...testMovies];
    const convertedMovies = convertDatasetToMovieFormat(allDatasetMovies, 1000);
    
    console.log(`✅ Converted ${convertedMovies.length} dataset movies`);
    
    // Add the dataset movies to the clean structure
    const newMoviesCode = convertedMovies.map(movie => {
      const safeTitle = movie.title.replace(/"/g, '\\\\"');
      const safeSynopsis = movie.synopsis.replace(/"/g, '\\\\"').replace(/\\n/g, ' ').replace(/\\r/g, ' ');
      
      return `  {
    id: "${movie.id}",
    title: "${safeTitle}",
    releaseYear: ${movie.releaseYear},
    releaseDate: "${movie.releaseDate}",
    runtime: ${movie.runtime},
    certification: "${movie.certification}",
    language: "${movie.language}",
    budget: "${movie.budget}",
    boxOffice: "${movie.boxOffice}",
    genres: ${JSON.stringify(movie.genres)},
    averageRating: ${movie.averageRating},
    totalRatings: ${movie.totalRatings},
    popularity: ${movie.popularity},
    posterImage: "${movie.posterImage}",
    backdropImage: "${movie.backdropImage}",
    synopsis: "${safeSynopsis}",
    director: { name: "${movie.director.name}", image: "${movie.director.image}" },
    cast: ${JSON.stringify(movie.cast)},
    productionCompanies: ${JSON.stringify(movie.productionCompanies)},
    ratingDistribution: ${JSON.stringify(movie.ratingDistribution)},
    source: "${movie.source}"
  }`;
    }).join(',\\n');
    
    // Insert movies into the clean structure
    const moviesArrayEnd = cleanMoviesContent.indexOf('];');
    const beforeClosing = cleanMoviesContent.substring(0, moviesArrayEnd);
    const afterClosing = cleanMoviesContent.substring(moviesArrayEnd);
    
    const updatedContent = beforeClosing + ',\\n' + newMoviesCode + '\\n' + afterClosing;
    
    // Write the optimized file
    console.log('💾 Writing optimized movies file...');
    fs.writeFileSync(MOVIES_FILE, updatedContent, 'utf8');
    
    console.log('🎉 Optimized integration completed successfully!');
    console.log(`📈 Total movies added: ${convertedMovies.length}`);
    console.log(`📁 File size: ${(updatedContent.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Generate summary statistics
    const genreStats = {};
    convertedMovies.forEach(movie => {
      movie.genres.forEach(genre => {
        genreStats[genre] = (genreStats[genre] || 0) + 1;
      });
    });
    
    console.log('\\n📊 Genre Distribution:');
    Object.entries(genreStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([genre, count]) => {
        console.log(`   ${genre}: ${count} movies`);
      });
    
    console.log('\\n✅ Ready to run the project!');
    
    return {
      success: true,
      moviesAdded: convertedMovies.length,
      genreStats
    };
    
  } catch (error) {
    console.error('❌ Error in optimized integration:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the optimized integration
optimizedIntegration().then(result => {
  if (result.success) {
    console.log('\\n🚀 You can now run: npm start');
    process.exit(0);
  } else {
    process.exit(1);
  }
});
