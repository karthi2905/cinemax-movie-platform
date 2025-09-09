const fs = require('fs');
const path = require('path');

const MOVIES_FILE = path.join(__dirname, '..', 'data', 'movies.js');

function extractMovieImageInfo() {
  try {
    console.log('🎬 Extracting Movie Image Information...\n');
    
    // Read the movies file
    const content = fs.readFileSync(MOVIES_FILE, 'utf8');
    
    // Extract movie objects using regex
    const movieMatches = content.match(/{\s*id:\s*"[^"]+",[\s\S]*?source:\s*"[^"]+"\s*}/g);
    
    if (!movieMatches) {
      console.log('❌ No movies found in the file');
      return;
    }
    
    const movieList = [];
    
    movieMatches.forEach((movieMatch, index) => {
      try {
        // Extract title
        const titleMatch = movieMatch.match(/title:\s*"([^"]+)"/);
        const title = titleMatch ? titleMatch[1] : `Unknown Title ${index + 1}`;
        
        // Extract id
        const idMatch = movieMatch.match(/id:\s*"([^"]+)"/);
        const id = idMatch ? idMatch[1] : `unknown_${index + 1}`;
        
        // Extract release year
        const yearMatch = movieMatch.match(/releaseYear:\s*(\d+)/);
        const releaseYear = yearMatch ? parseInt(yearMatch[1]) : 'Unknown';
        
        // Extract genres
        const genresMatch = movieMatch.match(/genres:\s*(\[[^\]]+\])/);
        let genres = [];
        if (genresMatch) {
          try {
            genres = JSON.parse(genresMatch[1]);
          } catch (e) {
            genres = ['Unknown'];
          }
        }
        
        // Extract poster image
        const posterMatch = movieMatch.match(/posterImage:\s*"([^"]+)"/);
        const posterImage = posterMatch ? posterMatch[1] : 'No poster';
        
        // Extract backdrop image
        const backdropMatch = movieMatch.match(/backdropImage:\s*"([^"]+)"/);
        const backdropImage = backdropMatch ? backdropMatch[1] : 'No backdrop';
        
        // Extract source
        const sourceMatch = movieMatch.match(/source:\s*"([^"]+)"/);
        const source = sourceMatch ? sourceMatch[1] : 'unknown';
        
        movieList.push({
          id,
          title,
          releaseYear,
          genres: genres.join(', '),
          posterImage,
          backdropImage,
          source,
          needsPoster: posterImage.includes('unsplash.com'),
          needsBackdrop: backdropImage.includes('unsplash.com')
        });
        
      } catch (error) {
        console.warn(`Error parsing movie ${index + 1}:`, error);
      }
    });
    
    console.log(`📊 Found ${movieList.length} total movies\n`);
    
    // Separate movies by source
    const originalMovies = movieList.filter(movie => !movie.source.includes('dataset'));
    const datasetMovies = movieList.filter(movie => movie.source.includes('dataset'));
    
    console.log(`📈 Breakdown:`);
    console.log(`   Original movies: ${originalMovies.length}`);
    console.log(`   Dataset movies: ${datasetMovies.length}\n`);
    
    // Count movies that need images
    const needsPosterImages = movieList.filter(movie => movie.needsPoster);
    const needsBackdropImages = movieList.filter(movie => movie.needsBackdrop);
    
    console.log(`🖼️  Image Requirements:`);
    console.log(`   Movies needing poster images: ${needsPosterImages.length}`);
    console.log(`   Movies needing backdrop images: ${needsBackdropImages.length}\n`);
    
    // Generate CSV format for easy importing
    const csvHeader = 'ID,Title,Year,Genres,Source,Current_Poster,Current_Backdrop,Needs_Poster,Needs_Backdrop';
    const csvRows = movieList.map(movie => {
      const safeTitle = movie.title.replace(/"/g, '""'); // Escape quotes for CSV
      return `"${movie.id}","${safeTitle}","${movie.releaseYear}","${movie.genres}","${movie.source}","${movie.posterImage}","${movie.backdropImage}","${movie.needsPoster}","${movie.needsBackdrop}"`;
    });
    
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Write CSV file
    const csvFilePath = path.join(__dirname, '..', '..', 'movie_images_list.csv');
    fs.writeFileSync(csvFilePath, csvContent, 'utf8');
    console.log(`📁 CSV file created: ${csvFilePath}\n`);
    
    // Generate detailed lists
    console.log('🎯 MOVIES NEEDING POSTER IMAGES:');
    console.log('=' .repeat(80));
    needsPosterImages.forEach((movie, index) => {
      console.log(`${index + 1}. "${movie.title}" (${movie.releaseYear}) [${movie.genres}]`);
      console.log(`   ID: ${movie.id} | Source: ${movie.source}`);
      console.log(`   Current: ${movie.posterImage}`);
      console.log('');
    });
    
    console.log('\n🎯 MOVIES NEEDING BACKDROP IMAGES:');
    console.log('=' .repeat(80));
    needsBackdropImages.forEach((movie, index) => {
      console.log(`${index + 1}. "${movie.title}" (${movie.releaseYear}) [${movie.genres}]`);
      console.log(`   ID: ${movie.id} | Source: ${movie.source}`);
      console.log(`   Current: ${movie.backdropImage}`);
      console.log('');
    });
    
    // Generate JSON file for programmatic use
    const jsonData = {
      totalMovies: movieList.length,
      originalMovies: originalMovies.length,
      datasetMovies: datasetMovies.length,
      needsPosterImages: needsPosterImages.length,
      needsBackdropImages: needsBackdropImages.length,
      movies: movieList,
      moviesNeedingPosters: needsPosterImages,
      moviesNeedingBackdrops: needsBackdropImages
    };
    
    const jsonFilePath = path.join(__dirname, '..', '..', 'movie_images_data.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`📁 JSON file created: ${jsonFilePath}\n`);
    
    // Summary for image sourcing
    console.log('🔍 IMAGE SOURCING SUMMARY:');
    console.log('=' .repeat(80));
    console.log('For proper movie poster and backdrop images, consider:');
    console.log('• TMDB (The Movie Database) API for official images');
    console.log('• OMDB API for movie metadata and images');
    console.log('• Unsplash/Pexels for generic movie-themed backgrounds');
    console.log('• Manual curation for high-quality specific movie images');
    console.log('');
    console.log('Current placeholder images are from Unsplash with generic movie themes.');
    console.log('Dataset movies especially need proper movie-specific images.\n');
    
    return {
      success: true,
      totalMovies: movieList.length,
      needsPosterImages: needsPosterImages.length,
      needsBackdropImages: needsBackdropImages.length,
      csvFilePath,
      jsonFilePath
    };
    
  } catch (error) {
    console.error('❌ Error extracting movie image info:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the extraction
extractMovieImageInfo();
