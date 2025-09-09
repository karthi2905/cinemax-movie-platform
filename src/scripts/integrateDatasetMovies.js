import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'data');
const TRAIN_DATA_FILE = path.join(DATA_DIR, 'train_data.txt');
const TEST_DATA_FILE = path.join(DATA_DIR, 'test_data.txt');
const MOVIES_FILE = path.join(DATA_DIR, 'movies.js');

// Helper functions
const extractYearFromTitle = (title) => {
  const yearMatch = title.match(/\((\d{4})\)/);
  return yearMatch ? parseInt(yearMatch[1]) : null;
};

const cleanTitle = (title) => {
  return title.replace(/\(\d{4}(?:\/[IV]+)?\)/, '').trim();
};

const capitalizeGenre = (genre) => {
  if (!genre || genre === 'null') return 'Unknown';
  
  // Map dataset genres to CineMax format
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
    'photo-1574375927938-d5a98e8ffe85',
    'photo-1515634928627-2a4e0dae3ddf',
    'photo-1509281373149-e957c6296406',
    'photo-1478720568477-b999d8c3e24b',
    'photo-1616530940355-351fabd9524b',
    'photo-1542204165-65bf26472b9b'
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
    'photo-1574375927938-d5a98e8ffe85',
    'photo-1515634928627-2a4e0dae3ddf',
    'photo-1509281373149-e957c6296406',
    'photo-1478720568477-b999d8c3e24b',
    'photo-1616530940355-351fabd9524b',
    'photo-1542204165-65bf26472b9b'
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
    'Greta Gerwig', 'Rian Johnson', 'James Cameron', 'Tim Burton',
    'Coen Brothers', 'Wes Anderson', 'Paul Thomas Anderson', 'Sofia Coppola',
    'Ridley Scott', 'George Lucas', 'Peter Jackson', 'Francis Ford Coppola'
  ];
  return directors[Math.floor(Math.random() * directors.length)];
};

const getRandomActors = () => {
  const actors = [
    'Leonardo DiCaprio', 'Meryl Streep', 'Robert De Niro', 'Tom Hanks',
    'Scarlett Johansson', 'Morgan Freeman', 'Brad Pitt', 'Natalie Portman',
    'Christian Bale', 'Cate Blanchett', 'Matthew McConaughey', 'Amy Adams',
    'Ryan Gosling', 'Emma Stone', 'Denzel Washington', 'Jennifer Lawrence',
    'Oscar Isaac', 'Tilda Swinton', 'Joaquin Phoenix', 'Frances McDormand'
  ];
  
  const shuffled = actors.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2).map((name, index) => ({
    name,
    character: index === 0 ? 'Main Character' : 'Supporting Role',
    image: `https://images.unsplash.com/photo-${index === 0 ? '1500648767791-00dcc994a43e' : '1472099645785-5658abf4ff4e'}?w=100&h=100&fit=crop`
  }));
};

// Parse dataset files
const parseTrainingData = (fileContent) => {
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
          source: 'dataset-train'
        });
      }
    } catch (error) {
      console.warn(`Error parsing training line ${index + 1}:`, error);
    }
  });
  
  return movies;
};

const parseTestData = (fileContent) => {
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
          source: 'dataset-test'
        });
      }
    } catch (error) {
      console.warn(`Error parsing test line ${index + 1}:`, error);
    }
  });
  
  return movies;
};

// Convert dataset movies to CineMax format
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
      runtime: Math.floor(Math.random() * (180 - 90) + 90), // Random runtime 90-180 mins
      certification: getRandomCertification(),
      language: "English",
      budget: "N/A",
      boxOffice: "N/A",
      genres: movie.genre ? [genre] : ['Unknown'],
      averageRating: parseFloat((Math.random() * 4 + 6).toFixed(1)), // Random rating 6.0-10.0
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

// Main integration function
async function integrateDatasetMovies() {
  try {
    console.log('🎬 Starting CineMax Dataset Integration...');
    
    // Read dataset files
    console.log('📂 Reading dataset files...');
    const trainData = fs.readFileSync(TRAIN_DATA_FILE, 'utf8');
    const testData = fs.readFileSync(TEST_DATA_FILE, 'utf8');
    
    // Parse dataset movies
    console.log('🔍 Parsing dataset movies...');
    const trainingMovies = parseTrainingData(trainData);
    const testMovies = parseTestData(testData);
    
    console.log(`📊 Found ${trainingMovies.length} training movies and ${testMovies.length} test movies`);
    
    // Combine and convert to CineMax format
    console.log('🔄 Converting to CineMax format...');
    const allDatasetMovies = [...trainingMovies, ...testMovies];
    const convertedMovies = convertDatasetToMovieFormat(allDatasetMovies, 1000);
    
    console.log(`✅ Converted ${convertedMovies.length} dataset movies`);
    
    // Read existing movies.js file
    console.log('📖 Reading existing movies file...');
    let moviesFileContent = fs.readFileSync(MOVIES_FILE, 'utf8');
    
    // Find the end of the existing movies array
    const moviesArrayEnd = moviesFileContent.lastIndexOf('];');
    if (moviesArrayEnd === -1) {
      throw new Error('Could not find the end of movies array in movies.js');
    }
    
    // Generate the new movies code
    const newMoviesCode = convertedMovies.map(movie => {
      return `  {
    id: "${movie.id}",
    title: "${movie.title.replace(/"/g, '\\"')}",
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
    synopsis: "${movie.synopsis.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
    director: { name: "${movie.director.name}", image: "${movie.director.image}" },
    cast: ${JSON.stringify(movie.cast)},
    productionCompanies: ${JSON.stringify(movie.productionCompanies)},
    ratingDistribution: ${JSON.stringify(movie.ratingDistribution)},
    source: "${movie.source}"
  }`;
    }).join(',\n');
    
    // Insert the new movies before the closing bracket
    const beforeClosing = moviesFileContent.substring(0, moviesArrayEnd);
    const afterClosing = moviesFileContent.substring(moviesArrayEnd);
    
    // Add comma if there are existing movies
    const needsComma = beforeClosing.trim().endsWith('}');
    const separator = needsComma ? ',\n' : '\n';
    
    const updatedContent = beforeClosing + separator + newMoviesCode + '\n' + afterClosing;
    
    // Write the updated file
    console.log('💾 Writing updated movies file...');
    fs.writeFileSync(MOVIES_FILE, updatedContent, 'utf8');
    
    console.log('🎉 Dataset integration completed successfully!');
    console.log(`📈 Total movies added: ${convertedMovies.length}`);
    console.log('🔍 Dataset movies will now appear in:');
    console.log('   - Search results');
    console.log('   - Genre collections');
    console.log('   - Home page recommendations');
    console.log('   - All movie browsing');
    
    // Generate summary statistics
    const genreStats = {};
    convertedMovies.forEach(movie => {
      movie.genres.forEach(genre => {
        genreStats[genre] = (genreStats[genre] || 0) + 1;
      });
    });
    
    console.log('\n📊 Genre Distribution:');
    Object.entries(genreStats)
      .sort(([,a], [,b]) => b - a)
      .forEach(([genre, count]) => {
        console.log(`   ${genre}: ${count} movies`);
      });
    
    return {
      success: true,
      moviesAdded: convertedMovies.length,
      genreStats
    };
    
  } catch (error) {
    console.error('❌ Error integrating dataset movies:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the integration
if (import.meta.url === `file://${process.argv[1]}`) {
  integrateDatasetMovies().then(result => {
    if (result.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  });
}

export { integrateDatasetMovies, parseTrainingData, parseTestData, convertDatasetToMovieFormat };
