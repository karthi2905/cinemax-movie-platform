const fs = require('fs');
const path = require('path');
const https = require('https');

// TMDB API Configuration
const TMDB_API_KEY = '0b900545c352a74438995f22544d866b'; // Your TMDB API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const POSTER_SIZE = 'w500';
const BACKDROP_SIZE = 'w1280';

// Paths
const MOVIES_FILE_PATH = path.join(__dirname, '../data/movies.js');
const CSV_FILE_PATH = path.join(__dirname, '../../movie_images_list.csv');
const UPDATED_CSV_PATH = 'C:/Users/karth/Downloads/updated_movie_images_list.csv';
const BACKUP_PATH = path.join(__dirname, '../data/movies_backup.js');
const LOG_FILE = path.join(__dirname, '../../image_replacement_log.txt');

// Rate limiting
const RATE_LIMIT_DELAY = 250; // 250ms delay between API calls (4 requests per second)
let requestCount = 0;
let successCount = 0;
let failureCount = 0;

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

// Sleep function for rate limiting
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Log function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    console.log(message);
    fs.appendFileSync(LOG_FILE, logMessage);
}

// Search for movie on TMDB
async function searchMovie(title, year) {
    try {
        requestCount++;
        const cleanTitle = title.replace(/[\(\)\"]/g, '').trim();
        const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&year=${year}&page=1`;
        
        log(`🔍 Searching: "${cleanTitle}" (${year})`);
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
        log(`❌ Error searching for "${title}": ${error.message}`);
        return null;
    }
}

// Get movie images from TMDB
function getMovieImages(tmdbMovie) {
    const posterPath = tmdbMovie.poster_path;
    const backdropPath = tmdbMovie.backdrop_path;
    
    return {
        posterUrl: posterPath ? `${TMDB_IMAGE_BASE}/${POSTER_SIZE}${posterPath}` : null,
        backdropUrl: backdropPath ? `${TMDB_IMAGE_BASE}/${BACKDROP_SIZE}${backdropPath}` : null
    };
}

// Read and parse CSV file
function readCSV(filePath) {
    try {
        const csvContent = fs.readFileSync(filePath, 'utf8');
        const lines = csvContent.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',');
        
        const movies = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            const movie = {};
            headers.forEach((header, index) => {
                movie[header.trim()] = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
            });
            
            // Only process movies that need images
            if (movie.Needs_Poster === 'True' || movie.Needs_Backdrop === 'True') {
                movies.push(movie);
            }
        }
        
        return movies;
    } catch (error) {
        log(`❌ Error reading CSV file: ${error.message}`);
        return [];
    }
}

// Read movies.js file
function readMoviesFile() {
    try {
        const moviesContent = fs.readFileSync(MOVIES_FILE_PATH, 'utf8');
        // Extract movies array from the file
        const moviesMatch = moviesContent.match(/const movies = (\[[\s\S]*?\]);/);
        if (moviesMatch) {
            const moviesArrayString = moviesMatch[1];
            // Use eval to parse the array (be careful with this in production)
            const movies = eval(moviesArrayString);
            return { content: moviesContent, movies };
        }
        throw new Error('Could not find movies array in movies.js');
    } catch (error) {
        log(`❌ Error reading movies.js: ${error.message}`);
        return null;
    }
}

// Update movie object with new images
function updateMovieImages(movie, newImages) {
    if (newImages.posterUrl && movie.poster !== newImages.posterUrl) {
        movie.poster = newImages.posterUrl;
    }
    if (newImages.backdropUrl && movie.backdrop !== newImages.backdropUrl) {
        movie.backdrop = newImages.backdropUrl;
    }
    return movie;
}

// Write updated movies back to file
function writeMoviesFile(content, updatedMovies) {
    try {
        // Create backup first
        fs.copyFileSync(MOVIES_FILE_PATH, BACKUP_PATH);
        log(`✅ Created backup at: ${BACKUP_PATH}`);
        
        // Convert movies array back to string format
        const moviesArrayString = JSON.stringify(updatedMovies, null, 2);
        const updatedContent = content.replace(
            /const movies = \[[\s\S]*?\];/,
            `const movies = ${moviesArrayString};`
        );
        
        fs.writeFileSync(MOVIES_FILE_PATH, updatedContent, 'utf8');
        log(`✅ Updated movies.js successfully`);
        return true;
    } catch (error) {
        log(`❌ Error writing movies.js: ${error.message}`);
        return false;
    }
}

// Update CSV with progress
function updateCSV(csvMovies, processedMovies) {
    try {
        const headers = 'ID,Title,Year,Genres,Source,Current_Poster,Current_Backdrop,Needs_Poster,Needs_Backdrop';
        const csvLines = [headers];
        
        for (const movie of csvMovies) {
            const processed = processedMovies.find(p => p.id === movie.ID);
            if (processed && processed.updated) {
                movie.Current_Poster = processed.poster || movie.Current_Poster;
                movie.Current_Backdrop = processed.backdrop || movie.Current_Backdrop;
                movie.Needs_Poster = processed.poster ? 'False' : movie.Needs_Poster;
                movie.Needs_Backdrop = processed.backdrop ? 'False' : movie.Needs_Backdrop;
            }
            
            const line = `${movie.ID},"${movie.Title}",${movie.Year},"${movie.Genres}","${movie.Source}","${movie.Current_Poster}","${movie.Current_Backdrop}",${movie.Needs_Poster},${movie.Needs_Backdrop}`;
            csvLines.push(line);
        }
        
        fs.writeFileSync(UPDATED_CSV_PATH, csvLines.join('\n'), 'utf8');
        log(`✅ Updated CSV file with progress`);
    } catch (error) {
        log(`❌ Error updating CSV: ${error.message}`);
    }
}

// Main function
async function replaceMovieImages() {
    // Check if TMDB API key is set
    if (TMDB_API_KEY === 'YOUR_TMDB_API_KEY_HERE') {
        log('❌ Please set your TMDB API key in the script before running!');
        log('📝 Get your API key from: https://www.themoviedb.org/settings/api');
        return;
    }
    
    // Initialize log file
    fs.writeFileSync(LOG_FILE, `🎬 Movie Image Replacement Started: ${new Date().toISOString()}\n`);
    log('🎬 Starting movie image replacement process...');
    
    // Read CSV file with movies needing images
    log('📊 Reading CSV file...');
    const csvMovies = readCSV(UPDATED_CSV_PATH);
    if (csvMovies.length === 0) {
        log('❌ No movies found that need image replacement');
        return;
    }
    log(`📋 Found ${csvMovies.length} movies needing image updates`);
    
    // Read current movies.js file
    log('📖 Reading movies.js file...');
    const moviesData = readMoviesFile();
    if (!moviesData) {
        log('❌ Could not read movies.js file');
        return;
    }
    
    const { content, movies } = moviesData;
    log(`📚 Loaded ${movies.length} movies from movies.js`);
    
    const processedMovies = [];
    let currentIndex = 0;
    
    // Process each movie
    for (const csvMovie of csvMovies) {
        currentIndex++;
        const movieId = csvMovie.ID; // Keep as string to match movies.js IDs
        
        log(`\n🎯 Processing ${currentIndex}/${csvMovies.length}: "${csvMovie.Title}" (${csvMovie.Year})`);
        
        // Find corresponding movie in movies.js
        const movieIndex = movies.findIndex(m => m.id === movieId);
        if (movieIndex === -1) {
            log(`⚠️ Movie ID ${movieId} not found in movies.js`);
            continue;
        }
        
        // Rate limiting
        if (requestCount > 0) {
            await sleep(RATE_LIMIT_DELAY);
        }
        
        // Search for movie on TMDB
        const tmdbMovie = await searchMovie(csvMovie.Title, csvMovie.Year);
        
        if (tmdbMovie) {
            const images = getMovieImages(tmdbMovie);
            
            if (images.posterUrl || images.backdropUrl) {
                // Update the movie in the movies array
                if (images.posterUrl) {
                    movies[movieIndex].posterImage = images.posterUrl;
                    log(`✅ Updated poster: ${images.posterUrl}`);
                }
                if (images.backdropUrl) {
                    movies[movieIndex].backdropImage = images.backdropUrl;
                    log(`✅ Updated backdrop: ${images.backdropUrl}`);
                }
                
                processedMovies.push({
                    id: movieId,
                    poster: images.posterUrl,
                    backdrop: images.backdropUrl,
                    updated: true
                });
                
                successCount++;
            } else {
                log(`⚠️ No images found for "${csvMovie.Title}"`);
                failureCount++;
            }
        } else {
            log(`❌ Movie not found on TMDB: "${csvMovie.Title}"`);
            failureCount++;
        }
        
        // Save progress every 50 movies
        if (currentIndex % 50 === 0) {
            log(`\n💾 Saving progress... (${currentIndex}/${csvMovies.length})`);
            writeMoviesFile(content, movies);
            updateCSV(csvMovies, processedMovies);
        }
    }
    
    // Final save
    log('\n💾 Saving final results...');
    writeMoviesFile(content, movies);
    updateCSV(csvMovies, processedMovies);
    
    // Summary
    log('\n🎉 Movie image replacement completed!');
    log(`📊 Summary:`);
    log(`   • Total processed: ${csvMovies.length}`);
    log(`   • Successfully updated: ${successCount}`);
    log(`   • Failed to find: ${failureCount}`);
    log(`   • API requests made: ${requestCount}`);
    log(`📁 Log file saved: ${LOG_FILE}`);
    log(`💾 Backup created: ${BACKUP_PATH}`);
    
    console.log('\n🎯 Next steps:');
    console.log('1. Review the log file for any issues');
    console.log('2. Test your application with the new images');
    console.log('3. If satisfied, you can delete the backup file');
}

// Run if called directly
if (require.main === module) {
    replaceMovieImages().catch(error => {
        log(`💥 Script failed: ${error.message}`);
        console.error(error);
    });
}

module.exports = { replaceMovieImages };
