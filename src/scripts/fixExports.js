const fs = require('fs');
const path = require('path');

const MOVIES_FILE = path.join(__dirname, '..', 'data', 'movies.js');

function fixExports() {
  try {
    console.log('🔧 Fixing corrupted exports in movies.js...');
    
    // Read the file
    let content = fs.readFileSync(MOVIES_FILE, 'utf8');
    
    // Find the corrupted export line
    const corruptedPattern = /export const allMovies = \[\.\.\.movies\s*\{/g;
    
    if (corruptedPattern.test(content)) {
      console.log('✅ Found corrupted export line, fixing...');
      
      // Remove the duplicate export sections that were added at the end
      content = content.replace(/\n\/\/ Genre collections for easy filtering[\s\S]*$/, '');
      
      // Fix the corrupted export line by replacing it with proper exports
      content = content.replace(
        /export const allMovies = \[\.\.\.movies\s*/g,
        ''
      );
      
      // Add proper exports at the end
      const properExports = `

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
      
      // Append the proper exports
      content += properExports;
      
      // Write the fixed file
      fs.writeFileSync(MOVIES_FILE, content, 'utf8');
      
      console.log('🎉 Export statements fixed successfully!');
      console.log('✅ Dataset movies will now be properly included in:');
      console.log('   - allMovies export');
      console.log('   - Genre collections');
      console.log('   - Popular collections');
      
      return { success: true };
    } else {
      console.log('❌ Could not find corrupted export pattern');
      return { success: false, error: 'Pattern not found' };
    }
    
  } catch (error) {
    console.error('❌ Error fixing exports:', error);
    return { success: false, error: error.message };
  }
}

// Run the fix
fixExports();
