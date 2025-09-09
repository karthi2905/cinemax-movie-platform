import { useState, useEffect, useCallback } from 'react';
import { 
  parseTrainingData, 
  parseTestData, 
  getDatasetGenres, 
  convertDatasetToMovieFormat,
  searchMoviesByDescription,
  filterMoviesByDatasetGenre,
  getGenreStatistics
} from '../data/datasetUtils';

// Custom hook for managing the movie dataset
export const useMovieDataset = () => {
  const [trainingData, setTrainingData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [genreStats, setGenreStats] = useState([]);
  const [usingFullDataset, setUsingFullDataset] = useState(false);

  // Load dataset files from the public directory
  const loadDatasetFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Since the files are in src/data, we'll need to import them differently
      // For now, let's create sample data based on what we saw in the files
      
      // This would normally be loaded from files, but we'll use a sample for demo
      const sampleTrainingData = [
        {
          id: "1",
          title: "Oscar et la dame rose (2009)",
          genre: "drama",
          description: "Listening in to a conversation between his doctor and parents, 10-year-old Oscar learns what nobody has the courage to tell him. He only has a few weeks to live.",
          source: "dataset"
        },
        {
          id: "2", 
          title: "Cupid (1997)",
          genre: "thriller",
          description: "A brother and sister with a past incestuous relationship have a current murderous relationship. He murders the women who reject him and she murders the women who get too close to him.",
          source: "dataset"
        },
        {
          id: "3",
          title: "Young, Wild and Wonderful (1980)",
          genre: "adult",
          description: "As the bus empties the students for their field trip to the Museum of Natural History, little does the tour guide suspect that the students are there for more than just another tour.",
          source: "dataset"
        },
        {
          id: "4",
          title: "The Secret Sin (1915)",
          genre: "drama", 
          description: "To help their unemployed father make ends meet, Edith and her twin sister Grace work as seamstresses.",
          source: "dataset"
        },
        {
          id: "5",
          title: "The Unrecovered (2007)",
          genre: "drama",
          description: "The film's title refers not only to the un-recovered bodies at ground zero, but also to the state of the nation at large.",
          source: "dataset"
        }
      ];

      const sampleTestData = [
        {
          id: "1",
          title: "Unknown Movie 1",
          description: "A mysterious thriller about a detective investigating a series of crimes.",
          genre: null,
          source: "dataset"
        },
        {
          id: "2", 
          title: "Unknown Movie 2",
          description: "A heartwarming drama about family relationships and personal growth.",
          genre: null,
          source: "dataset"
        }
      ];

      setTrainingData(sampleTrainingData);
      setTestData(sampleTestData);
      
      const uniqueGenres = getDatasetGenres(sampleTrainingData);
      setGenres(uniqueGenres);
      
      const stats = getGenreStatistics(sampleTrainingData);
      setGenreStats(stats);

    } catch (err) {
      setError(err.message);
      console.error('Error loading dataset:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the actual dataset files
  const loadActualDatasetFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load the processed dataset from the JSON file
      const response = await fetch('/data/sample-movie-dataset.json');
      if (!response.ok) {
        throw new Error('Could not load processed dataset');
      }
      
      const dataset = await response.json();
      
      setTrainingData(dataset.trainingData);
      setTestData(dataset.testData);
      setGenres(dataset.genres);
      setGenreStats(dataset.genreStats);

    } catch (err) {
      setError(err.message);
      console.error('Error loading dataset:', err);
      // Fallback to the previous sample data if needed
      loadFallbackData();
    } finally {
      setLoading(false);
    }
  }, []);

  // Fallback data in case the JSON file can't be loaded
  const loadFallbackData = useCallback(() => {
    const fallbackTrainingData = [
      { id: "1", title: "Oscar et la dame rose (2009)", genre: "drama", description: "Listening in to a conversation between his doctor and parents, 10-year-old Oscar learns what nobody has the courage to tell him.", source: "dataset" },
      { id: "2", title: "Cupid (1997)", genre: "thriller", description: "A brother and sister with a past incestuous relationship have a current murderous relationship.", source: "dataset" },
      { id: "3", title: "Young, Wild and Wonderful (1980)", genre: "adult", description: "As the bus empties the students for their field trip to the Museum of Natural History...", source: "dataset" },
      { id: "4", title: "The Secret Sin (1915)", genre: "drama", description: "To help their unemployed father make ends meet, Edith and her twin sister Grace work as seamstresses.", source: "dataset" },
      { id: "5", title: "Quality Control (2011)", genre: "documentary", description: "Quality Control consists of a series of 16mm single take shots filmed in the summer of 2010.", source: "dataset" }
    ];

    const fallbackTestData = [
      { id: "1", title: "Mystery Movie", description: "A detective investigates a series of murders that seem connected to an ancient conspiracy.", genre: null, source: "dataset" },
      { id: "2", title: "Space Adventure", description: "A crew of astronauts discovers a new planet with dangerous alien life forms.", genre: null, source: "dataset" }
    ];

    setTrainingData(fallbackTrainingData);
    setTestData(fallbackTestData);
    const uniqueGenres = getDatasetGenres(fallbackTrainingData);
    setGenres(uniqueGenres);
    const stats = getGenreStatistics(fallbackTrainingData);
    setGenreStats(stats);
  }, []);

  // Load the full dataset with all movies
  const loadFullDataset = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('Loading full dataset with 100k+ movies...');
      const response = await fetch('/data/full-movie-dataset.json');
      if (!response.ok) {
        throw new Error('Could not load full dataset');
      }
      
      const dataset = await response.json();
      
      setTrainingData(dataset.trainingData);
      setTestData(dataset.testData);
      setGenres(dataset.genres);
      setGenreStats(dataset.genreStats);
      setUsingFullDataset(true);
      
      console.log(`Loaded full dataset: ${dataset.trainingData.length} training + ${dataset.testData.length} test movies`);

    } catch (err) {
      setError('Failed to load full dataset: ' + err.message);
      console.error('Error loading full dataset:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Convert dataset to movie format for display
  const getMoviesInStandardFormat = useCallback(() => {
    return convertDatasetToMovieFormat(trainingData);
  }, [trainingData]);

  // Search functionality
  const searchDataset = useCallback((query) => {
    const trainingResults = searchMoviesByDescription(trainingData, query);
    const testResults = searchMoviesByDescription(testData, query);
    return { trainingResults, testResults };
  }, [trainingData, testData]);

  // Filter by genre
  const filterByGenre = useCallback((genre) => {
    return filterMoviesByDatasetGenre(trainingData, genre);
  }, [trainingData]);

  // Predict genre for test data (simple keyword-based prediction)
  const predictGenre = useCallback((description) => {
    if (!description) return 'unknown';

    const keywords = {
      action: ['fight', 'battle', 'war', 'gun', 'explosion', 'chase', 'hero'],
      comedy: ['funny', 'laugh', 'joke', 'humor', 'hilarious', 'comedy'],
      drama: ['family', 'relationship', 'life', 'emotional', 'personal'],
      horror: ['scary', 'monster', 'ghost', 'fear', 'death', 'dark'],
      romance: ['love', 'romantic', 'wedding', 'couple', 'relationship'],
      'sci-fi': ['space', 'future', 'alien', 'robot', 'technology', 'time'],
      thriller: ['mystery', 'suspense', 'investigation', 'detective', 'crime'],
      adventure: ['journey', 'quest', 'explore', 'travel', 'discover']
    };

    const lowerDescription = description.toLowerCase();
    let bestMatch = 'unknown';
    let maxScore = 0;

    Object.entries(keywords).forEach(([genre, words]) => {
      const score = words.reduce((acc, word) => {
        return acc + (lowerDescription.includes(word) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestMatch = genre;
      }
    });

    return bestMatch;
  }, []);

  // Initialize dataset on mount
  useEffect(() => {
    loadActualDatasetFiles();
  }, [loadActualDatasetFiles]);

  return {
    trainingData,
    testData,
    genres,
    genreStats,
    loading,
    error,
    usingFullDataset,
    loadDatasetFiles,
    loadActualDatasetFiles,
    loadFullDataset,
    getMoviesInStandardFormat,
    searchDataset,
    filterByGenre,
    predictGenre
  };
};
