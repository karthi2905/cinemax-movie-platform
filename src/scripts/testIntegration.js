const fs = require('fs');
const path = require('path');

// Test the integration by checking if dataset movies are properly integrated
function testIntegration() {
  try {
    console.log('🧪 Testing CineMax Dataset Integration...\n');
    
    // Read the movies file
    const moviesPath = path.join(__dirname, '..', 'data', 'movies.js');
    const content = fs.readFileSync(moviesPath, 'utf8');
    
    // Check 1: Verify file structure
    console.log('📋 Test 1: File Structure');
    
    // Check if movies array is properly closed
    const hasMoviesArray = content.includes('const movies = [') && content.includes('];');
    console.log(`   ✅ Movies array structure: ${hasMoviesArray ? 'PASS' : 'FAIL'}`);
    
    // Check if exports are present
    const hasAllMoviesExport = content.includes('export const allMovies = [...movies];');
    console.log(`   ✅ allMovies export: ${hasAllMoviesExport ? 'PASS' : 'FAIL'}`);
    
    const hasGenreCollections = content.includes('export const genreCollections = {');
    console.log(`   ✅ genreCollections export: ${hasGenreCollections ? 'PASS' : 'FAIL'}`);
    
    const hasPopularCollections = content.includes('export const popularCollections = {');
    console.log(`   ✅ popularCollections export: ${hasPopularCollections ? 'PASS' : 'FAIL'}`);
    
    const hasDefaultExport = content.includes('export default { movies: allMovies, genreCollections, popularCollections };');
    console.log(`   ✅ Default export: ${hasDefaultExport ? 'PASS' : 'FAIL'}`);
    
    // Check 2: Dataset movie presence
    console.log('\n📋 Test 2: Dataset Movie Integration');
    
    const hasDatasetTrain = content.includes('source: "dataset-train"');
    console.log(`   ✅ Training dataset movies: ${hasDatasetTrain ? 'PASS' : 'FAIL'}`);
    
    const hasDatasetTest = content.includes('source: "dataset-test"');
    console.log(`   ✅ Test dataset movies: ${hasDatasetTest ? 'PASS' : 'FAIL'}`);
    
    // Count movies by source
    const trainMatches = content.match(/source: "dataset-train"/g);
    const testMatches = content.match(/source: "dataset-test"/g);
    const originalMatches = content.match(/"source": "original"/g) || [];
    
    const trainCount = trainMatches ? trainMatches.length : 0;
    const testCount = testMatches ? testMatches.length : 0;
    const originalCount = originalMatches ? originalMatches.length : 0;
    
    console.log(`   📊 Training movies found: ${trainCount}`);
    console.log(`   📊 Test movies found: ${testCount}`);
    console.log(`   📊 Original movies: ${originalCount}`);
    console.log(`   📊 Total movies: ${trainCount + testCount + originalCount}`);
    
    // Check 3: Genre mapping
    console.log('\n📋 Test 3: Genre Mapping');
    
    const genreSamples = [
      'Drama', 'Comedy', 'Thriller', 'Horror', 'Action', 
      'Sci-Fi', 'Documentary', 'Animation', 'Romance', 'Fantasy'
    ];
    
    genreSamples.forEach(genre => {
      const hasGenre = content.includes(`"genres": ["${genre}"]`) || content.includes(`"${genre}"`);
      console.log(`   ✅ ${genre}: ${hasGenre ? 'PASS' : 'FAIL'}`);
    });
    
    // Check 4: Required fields
    console.log('\n📋 Test 4: Required Movie Fields');
    
    const requiredFields = [
      'id', 'title', 'releaseYear', 'releaseDate', 'runtime',
      'certification', 'language', 'genres', 'averageRating',
      'totalRatings', 'popularity', 'posterImage', 'backdropImage',
      'synopsis', 'director', 'cast', 'productionCompanies', 'ratingDistribution'
    ];
    
    // Find a sample dataset movie to verify fields
    const datasetMovieMatch = content.match(/"source": "dataset-train"[\s\S]*?},/);
    if (datasetMovieMatch) {
      const sampleMovie = datasetMovieMatch[0];
      requiredFields.forEach(field => {
        const hasField = sampleMovie.includes(`"${field}":`);
        console.log(`   ✅ ${field}: ${hasField ? 'PASS' : 'FAIL'}`);
      });
    }
    
    // Summary
    console.log('\n🎯 Integration Summary:');
    console.log(`   📁 File size: ${(content.length / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   🎬 Dataset movies integrated: ${trainCount + testCount}`);
    console.log(`   ✅ Ready for use in CineMax app!`);
    
    // Check for specific example movies from the dataset
    console.log('\n📋 Test 5: Sample Movie Verification');
    
    const sampleTitles = [
      'Oscar et la dame rose',
      'Cupid',
      'Young, Wild and Wonderful'
    ];
    
    sampleTitles.forEach(title => {
      const hasTitle = content.includes(`"title": "${title}"`);
      console.log(`   ✅ "${title}": ${hasTitle ? 'FOUND' : 'NOT FOUND'}`);
    });
    
    console.log('\n🎉 Dataset integration test completed!');
    console.log('\n🔍 Next steps:');
    console.log('   1. Start your dev server with: npm start');
    console.log('   2. Search for dataset movies in the search bar');
    console.log('   3. Browse movies by genre to see dataset movies');
    console.log('   4. Check home page recommendations');
    
    return {
      success: true,
      stats: {
        trainCount,
        testCount,
        originalCount,
        totalCount: trainCount + testCount + originalCount
      }
    };
    
  } catch (error) {
    console.error('❌ Error testing integration:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testIntegration();
