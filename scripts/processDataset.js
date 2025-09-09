const fs = require('fs');
const path = require('path');

// Function to parse training data
function parseTrainingData(fileContent) {
  const lines = fileContent.split('\n');
  const movies = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    try {
      // Format: ID ::: TITLE ::: GENRE ::: DESCRIPTION
      const parts = line.split(' ::: ');
      if (parts.length >= 4) {
        const [id, title, genre, ...descriptionParts] = parts;
        const description = descriptionParts.join(' ::: ').trim(); // In case description contains :::
        
        movies.push({
          id: id.trim(),
          title: title.trim(),
          genre: genre.trim().toLowerCase(),
          description: description,
          source: 'dataset'
        });
      }
    } catch (error) {
      console.warn(`Error parsing line ${index + 1}:`, error);
    }
  });
  
  return movies;
}

// Function to parse test data
function parseTestData(fileContent) {
  const lines = fileContent.split('\n');
  const movies = [];
  
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    
    try {
      // Format: ID ::: TITLE ::: DESCRIPTION
      const parts = line.split(' ::: ');
      if (parts.length >= 3) {
        const [id, title, ...descriptionParts] = parts;
        const description = descriptionParts.join(' ::: ').trim();
        
        movies.push({
          id: id.trim(),
          title: title.trim(),
          description: description,
          genre: null, // No genre in test data
          source: 'dataset'
        });
      }
    } catch (error) {
      console.warn(`Error parsing line ${index + 1}:`, error);
    }
  });
  
  return movies;
}

// Process the dataset files
async function processDataset() {
  console.log('Starting dataset processing...');
  
  try {
    const srcDataPath = path.join(__dirname, '../src/data');
    
    // Read training data
    console.log('Reading training data...');
    const trainDataPath = path.join(srcDataPath, 'train_data.txt');
    const trainContent = fs.readFileSync(trainDataPath, 'utf8');
    const trainingMovies = parseTrainingData(trainContent);
    console.log(`Parsed ${trainingMovies.length} training movies`);
    
    // Read test data
    console.log('Reading test data...');
    const testDataPath = path.join(srcDataPath, 'test_data.txt');
    const testContent = fs.readFileSync(testDataPath, 'utf8');
    const testMovies = parseTestData(testContent);
    console.log(`Parsed ${testMovies.length} test movies`);
    
    // Get unique genres
    const genreSet = new Set();
    trainingMovies.forEach(movie => {
      if (movie.genre && movie.genre !== 'null') {
        genreSet.add(movie.genre);
      }
    });
    const genres = Array.from(genreSet).sort();
    console.log(`Found ${genres.length} unique genres`);
    
    // Calculate genre statistics
    const genreCount = {};
    trainingMovies.forEach(movie => {
      if (movie.genre && movie.genre !== 'null') {
        genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
      }
    });
    
    const genreStats = Object.entries(genreCount)
      .map(([genre, count]) => ({ 
        genre: genre.charAt(0).toUpperCase() + genre.slice(1), 
        count 
      }))
      .sort((a, b) => b.count - a.count);
    
    // Create output data structure
    const output = {
      metadata: {
        trainingCount: trainingMovies.length,
        testCount: testMovies.length,
        totalCount: trainingMovies.length + testMovies.length,
        genreCount: genres.length,
        processedAt: new Date().toISOString()
      },
      genres,
      genreStats,
      trainingData: trainingMovies,
      testData: testMovies
    };
    
    // Write to public directory so it can be fetched by the browser
    const publicDataPath = path.join(__dirname, '../public/data');
    
    // Ensure directory exists
    if (!fs.existsSync(publicDataPath)) {
      fs.mkdirSync(publicDataPath, { recursive: true });
    }
    
    // Write the full dataset
    const outputPath = path.join(publicDataPath, 'full-movie-dataset.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`Dataset written to ${outputPath}`);
    
    // Create a smaller sample file for quick loading
    const sampleOutput = {
      ...output,
      trainingData: trainingMovies.slice(0, 1000),
      testData: testMovies.slice(0, 100),
      metadata: {
        ...output.metadata,
        note: 'This is a sample of the full dataset for quick loading'
      }
    };
    
    const samplePath = path.join(publicDataPath, 'sample-movie-dataset.json');
    fs.writeFileSync(samplePath, JSON.stringify(sampleOutput, null, 2));
    console.log(`Sample dataset written to ${samplePath}`);
    
    // Print summary
    console.log('\n=== Dataset Processing Summary ===');
    console.log(`Training movies: ${trainingMovies.length}`);
    console.log(`Test movies: ${testMovies.length}`);
    console.log(`Total movies: ${trainingMovies.length + testMovies.length}`);
    console.log(`Unique genres: ${genres.length}`);
    console.log(`Top 5 genres:`, genreStats.slice(0, 5).map(g => `${g.genre} (${g.count})`).join(', '));
    console.log('Files created:');
    console.log(`  - ${outputPath}`);
    console.log(`  - ${samplePath}`);
    
  } catch (error) {
    console.error('Error processing dataset:', error);
  }
}

// Run the processing
if (require.main === module) {
  processDataset();
}

module.exports = { processDataset, parseTrainingData, parseTestData };
