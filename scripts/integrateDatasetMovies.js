const fs = require('fs');
const path = require('path');

// Helper function to extract year from movie title
function extractYearFromTitle(title) {
  const yearMatch = title.match(/\((\d{4})\)/);
  return yearMatch ? parseInt(yearMatch[1]) : Math.floor(Math.random() * (2024 - 1980) + 1980);
}

// Helper function to clean movie title (remove year)
function cleanTitle(title) {
  return title.replace(/\(\d{4}(?:\/[IV]+)?\)/, '').trim();
}

// Helper function to capitalize genre
function capitalizeGenre(genre) {
  if (!genre) return 'Unknown';
  
  // Handle special cases
  const specialCases = {
    'sci-fi': 'Sci-Fi',
    'tv-movie': 'TV Movie',
    'reality-tv': 'Reality TV',
    'talk-show': 'Talk Show',
    'game-show': 'Game Show'
  };
  
  if (specialCases[genre.toLowerCase()]) {
    return specialCases[genre.toLowerCase()];
  }
  
  return genre.charAt(0).toUpperCase() + genre.slice(1);
}

// Helper function to get random certification
function getRandomCertification() {
  const certifications = ['G', 'PG', 'PG-13', 'R', 'NC-17'];
  return certifications[Math.floor(Math.random() * certifications.length)];
}

// Helper function to get random poster image
function getRandomPosterImage() {
  const posterIds = [
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1440404653325-ab127d49abc1',
    'photo-1518676590629-3dcbd9c5a5c9',
    'photo-1506905925346-21bda4d32df4',
    'photo-1574375927938-d5a98e8ffe85',
    'photo-1536440136628-849c177e76a1',
    'photo-1594909122845-11baa439b7bf',
    'photo-1515634928627-2a4e0dae3ddf'
  ];
  const randomId = posterIds[Math.floor(Math.random() * posterIds.length)];
  return `https://images.unsplash.com/${randomId}?w=500&h=750&fit=crop`;
}

// Helper function to get random backdrop image
function getRandomBackdropImage() {
  const backdropIds = [
    'photo-1489599510095-d93d9ad86e8d',
    'photo-1440404653325-ab127d49abc1',
    'photo-1518676590629-3dcbd9c5a5c9',
    'photo-1506905925346-21bda4d32df4',
    'photo-1574375927938-d5a98e8ffe85',
    'photo-1536440136628-849c177e76a1',
    'photo-1594909122845-11baa439b7bf',
    'photo-1515634928627-2a4e0dae3ddf'
  ];
  const randomId = backdropIds[Math.floor(Math.random() * backdropIds.length)];
  return `https://images.unsplash.com/${randomId}?w=1280&h=720&fit=crop`;
}

// Helper function to generate random rating distribution
function generateRandomRatingDistribution() {
  const total = 100;
  let remaining = total;
  const distribution = [];
  
  for (let stars = 5; stars >= 1; stars--) {
    if (stars === 1) {
      distribution.push({ stars, percentage: Math.max(0, remaining) });
    } else {
      const percentage = Math.floor(Math.random() * remaining * 0.6);
      distribution.push({ stars, percentage });
      remaining -= percentage;
    }
  }
  
  return distribution.reverse();
}

// Helper function to get director names based on genre
function getRandomDirector(genre) {
  const directors = {
    action: ['John McTiernan', 'Michael Bay', 'James Cameron', 'Zack Snyder'],
    drama: ['Martin Scorsese', 'Christopher Nolan', 'David Fincher', 'Paul Thomas Anderson'],
    comedy: ['Judd Apatow', 'Adam McKay', 'Edgar Wright', 'Christopher Guest'],
    horror: ['John Carpenter', 'Wes Craven', 'Jordan Peele', 'James Wan'],
    thriller: ['Alfred Hitchcock', 'Denis Villeneuve', 'Brian De Palma', 'David Lynch'],
    'sci-fi': ['Ridley Scott', 'Denis Villeneuve', 'Christopher Nolan', 'James Cameron'],
    documentary: ['Werner Herzog', 'Errol Morris', 'Morgan Spurlock', 'Alex Gibney'],
    default: ['Unknown Director', 'Independent Director', 'Emerging Director']
  };
  
  const genreDirectors = directors[genre.toLowerCase()] || directors.default;
  return genreDirectors[Math.floor(Math.random() * genreDirectors.length)];
}

// Convert dataset movie to CineMax format
function convertToMovieFormat(datasetMovie, startingId) {
  const releaseYear = extractYearFromTitle(datasetMovie.title);
  const cleanedTitle = cleanTitle(datasetMovie.title);
  const genre = capitalizeGenre(datasetMovie.genre);
  const director = getRandomDirector(datasetMovie.genre);
  
  return {
    id: startingId.toString(),
    title: cleanedTitle,
    releaseYear: releaseYear,
    releaseDate: `January 1, ${releaseYear}`,
    runtime: Math.floor(Math.random() * (180 - 80) + 80), // Random runtime 80-180 mins
    certification: getRandomCertification(),
    language: "English",
    budget: "N/A",
    boxOffice: "N/A",
    genres: [genre],
    averageRating: parseFloat((Math.random() * 4 + 6).toFixed(1)), // Random rating 6.0-10.0
    totalRatings: Math.floor(Math.random() * 100000) + 1000,
    popularity: Math.floor(Math.random() * 100) + 1,
    posterImage: getRandomPosterImage(),
    backdropImage: getRandomBackdropImage(),
    synopsis: datasetMovie.description,
    director: { 
      name: director, 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
    },
    cast: [
      { 
        name: "Lead Actor", 
        character: "Main Character", 
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" 
      },
      { 
        name: "Supporting Actor", 
        character: "Supporting Role", 
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" 
      }
    ],
    productionCompanies: ["Independent Studio"],
    ratingDistribution: generateRandomRatingDistribution(),
    source: 'dataset'
  };
}

// Main integration function
async function integrateDatasetMovies() {
  console.log('Starting dataset integration...');
  
  try {
    // Load the processed dataset
    const datasetPath = path.join(__dirname, '../public/data/sample-movie-dataset.json');
    if (!fs.existsSync(datasetPath)) {
      console.error('Dataset file not found. Please run processDataset.js first.');
      return;
    }
    
    const datasetContent = fs.readFileSync(datasetPath, 'utf8');
    const dataset = JSON.parse(datasetContent);
    
    console.log(`Found ${dataset.trainingData.length} movies in dataset`);
    
    // Read current movies.js file
    const moviesPath = path.join(__dirname, '../src/data/movies.js');
    const moviesContent = fs.readFileSync(moviesPath, 'utf8');
    
    // Extract existing movies array to count them
    const existingMoviesMatch = moviesContent.match(/export const movies = \[([\s\S]*?)\];/);
    if (!existingMoviesMatch) {
      console.error('Could not find existing movies array');
      return;
    }
    
    // Count existing movies (approximate)
    const existingMovieCount = (moviesContent.match(/id: "\d+"/g) || []).length;
    console.log(`Found ${existingMovieCount} existing movies`);
    
    // Convert dataset movies to CineMax format (limit to 1000 for performance)
    const moviesToAdd = Math.min(1000, dataset.trainingData.length);
    console.log(`Converting ${moviesToAdd} dataset movies...`);
    
    const convertedMovies = dataset.trainingData.slice(0, moviesToAdd).map((movie, index) => 
      convertToMovieFormat(movie, existingMovieCount + index + 1)
    );
    
    // Generate the new movies array content
    const newMoviesContent = convertedMovies.map(movie => {
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
    genres: [${movie.genres.map(g => `"${g}"`).join(', ')}],
    averageRating: ${movie.averageRating},
    totalRatings: ${movie.totalRatings},
    popularity: ${movie.popularity},
    posterImage: "${movie.posterImage}",
    backdropImage: "${movie.backdropImage}",
    synopsis: "${movie.synopsis.replace(/"/g, '\\"').replace(/\n/g, ' ')}",
    director: { name: "${movie.director.name}", image: "${movie.director.image}" },
    cast: [
      { name: "${movie.cast[0].name}", character: "${movie.cast[0].character}", image: "${movie.cast[0].image}" },
      { name: "${movie.cast[1].name}", character: "${movie.cast[1].character}", image: "${movie.cast[1].image}" }
    ],
    productionCompanies: [${movie.productionCompanies.map(c => `"${c}"`).join(', ')}],
    ratingDistribution: [${movie.ratingDistribution.map(r => `{ stars: ${r.stars}, percentage: ${r.percentage} }`).join(', ')}]
  }`;
    }).join(',\n');
    
    // Insert the new movies before the closing bracket
    const updatedMoviesContent = moviesContent.replace(
      /(\}\n\];)/,
      `  },\n${newMoviesContent}\n];`
    );
    
    // Create backup
    const backupPath = moviesPath + '.backup';
    fs.writeFileSync(backupPath, moviesContent);
    console.log(`Backup created at ${backupPath}`);
    
    // Write updated movies file
    fs.writeFileSync(moviesPath, updatedMoviesContent);
    console.log(`Updated movies.js with ${moviesToAdd} new movies`);
    
    // Update genre collections with new genres
    console.log('Updating genre collections...');
    
    // Print summary
    console.log('\n=== Integration Summary ===');
    console.log(`Original movies: ${existingMovieCount}`);
    console.log(`Added movies: ${moviesToAdd}`);
    console.log(`Total movies: ${existingMovieCount + moviesToAdd}`);
    
    // Count genres
    const genreCounts = {};
    convertedMovies.forEach(movie => {
      movie.genres.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    console.log('New genres added:');
    Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([genre, count]) => {
        console.log(`  ${genre}: ${count} movies`);
      });
    
  } catch (error) {
    console.error('Error during integration:', error);
  }
}

// Run the integration
if (require.main === module) {
  integrateDatasetMovies();
}

module.exports = { integrateDatasetMovies, convertToMovieFormat };
