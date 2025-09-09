const https = require('https');

// TMDB API Configuration - REPLACE WITH YOUR API KEY
const TMDB_API_KEY = '0b900545c352a74438995f22544d866b'; // Your TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Test movies from your CSV
const testMovies = [
    { title: "Before It's Too Late: A Film on Teenage Suicide", year: 1985, id: 1001 },
    { title: "Pauly Shore Is Dead", year: 2003, id: 1008 },
    { title: "The Company Men", year: 2010, id: 1036 },
    { title: "Hamlet", year: 1969, id: 1119 },
    { title: "Daniel", year: 1983, id: 1220 }
];

// Utility function to make HTTP requests
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Test TMDB API connection
async function testTMDBConnection() {
    console.log('🔧 Testing TMDB API Connection...\n');
    
    if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        console.log('❌ Please set your TMDB API key in this script first!');
        console.log('📝 Get your API key from: https://www.themoviedb.org/settings/api\n');
        return false;
    }
    
    try {
        const testUrl = `${TMDB_BASE_URL}/configuration?api_key=${TMDB_API_KEY}`;
        const response = await makeRequest(testUrl);
        
        if (response && response.images) {
            console.log('✅ TMDB API connection successful!');
            console.log(`📊 Base URL: ${response.images.secure_base_url}`);
            console.log(`🖼️  Available poster sizes: ${response.images.poster_sizes.join(', ')}`);
            console.log(`🎨 Available backdrop sizes: ${response.images.backdrop_sizes.join(', ')}\n`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.log(`❌ TMDB API connection failed: ${error.message}\n`);
        return false;
    }
}

// Search for a movie
async function searchMovie(title, year) {
    try {
        const cleanTitle = title.replace(/[\(\)\"]/g, '').trim();
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&year=${year}&page=1`;
        
        const response = await makeRequest(searchUrl);
        
        if (response.results && response.results.length > 0) {
            // Find best match (prefer exact year match)
            let bestMatch = response.results[0];
            for (const result of response.results) {
                const resultYear = result.release_date ? new Date(result.release_date).getFullYear() : null;
                if (resultYear === parseInt(year)) {
                    bestMatch = result;
                    break;
                }
            }
            
            return bestMatch;
        }
        
        return null;
    } catch (error) {
        console.log(`❌ Error searching for "${title}": ${error.message}`);
        return null;
    }
}

// Get movie images
function getMovieImages(tmdbMovie) {
    const posterPath = tmdbMovie.poster_path;
    const backdropPath = tmdbMovie.backdrop_path;
    
    return {
        posterUrl: posterPath ? `${TMDB_IMAGE_BASE}/w500${posterPath}` : null,
        backdropUrl: backdropPath ? `${TMDB_IMAGE_BASE}/w1280${backdropPath}` : null
    };
}

// Test movie image fetching
async function testMovieImageFetching() {
    console.log('🎬 Testing Movie Image Fetching...\n');
    
    let successCount = 0;
    let totalCount = testMovies.length;
    
    for (const movie of testMovies) {
        console.log(`🔍 Searching for: "${movie.title}" (${movie.year})`);
        
        const tmdbMovie = await searchMovie(movie.title, movie.year);
        
        if (tmdbMovie) {
            const images = getMovieImages(tmdbMovie);
            
            console.log(`   ✅ Found: "${tmdbMovie.title}" (${tmdbMovie.release_date?.substring(0, 4)})`);
            console.log(`   📊 TMDB ID: ${tmdbMovie.id}`);
            console.log(`   ⭐ Rating: ${tmdbMovie.vote_average}/10`);
            
            if (images.posterUrl) {
                console.log(`   🖼️  Poster: ${images.posterUrl}`);
            }
            if (images.backdropUrl) {
                console.log(`   🎨 Backdrop: ${images.backdropUrl}`);
            }
            
            successCount++;
        } else {
            console.log(`   ❌ Not found on TMDB`);
        }
        
        console.log(''); // Empty line for readability
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`📊 Test Results: ${successCount}/${totalCount} movies found (${Math.round(successCount/totalCount*100)}% success rate)\n`);
    
    return successCount > 0;
}

// Main test function
async function runTests() {
    console.log('🎯 TMDB API Test Suite\n');
    console.log('='.repeat(50) + '\n');
    
    // Test 1: API Connection
    const connectionOk = await testTMDBConnection();
    if (!connectionOk) {
        console.log('💥 Cannot proceed - fix API connection first');
        return;
    }
    
    // Test 2: Movie Image Fetching
    const imageTestOk = await testMovieImageFetching();
    
    // Summary
    console.log('='.repeat(50));
    console.log('📋 TEST SUMMARY:');
    console.log(`   🔗 API Connection: ${connectionOk ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   🎬 Image Fetching: ${imageTestOk ? '✅ PASS' : '❌ FAIL'}`);
    
    if (connectionOk && imageTestOk) {
        console.log('\n🎉 All tests passed! You can now run the full replacement script.');
        console.log('📝 Next step: node src/scripts/replaceMovieImages.js');
    } else {
        console.log('\n⚠️  Some tests failed. Please fix the issues before running the full script.');
    }
    
    console.log('\n📖 For full instructions, see: MOVIE_IMAGE_REPLACEMENT_GUIDE.md');
}

// Run tests
runTests().catch(error => {
    console.error('💥 Test suite failed:', error);
});
