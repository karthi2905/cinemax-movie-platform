import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GenrePreferences = ({ onPreferencesSubmit, onSkip }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const genres = [
    { id: 'action', name: 'Action', icon: 'Zap' },
    { id: 'comedy', name: 'Comedy', icon: 'Smile' },
    { id: 'drama', name: 'Drama', icon: 'Theater' },
    { id: 'horror', name: 'Horror', icon: 'Ghost' },
    { id: 'romance', name: 'Romance', icon: 'Heart' },
    { id: 'sci-fi', name: 'Sci-Fi', icon: 'Rocket' },
    { id: 'thriller', name: 'Thriller', icon: 'Eye' },
    { id: 'adventure', name: 'Adventure', icon: 'Map' },
    { id: 'animation', name: 'Animation', icon: 'Palette' },
    { id: 'documentary', name: 'Documentary', icon: 'Camera' },
    { id: 'fantasy', name: 'Fantasy', icon: 'Wand2' },
    { id: 'mystery', name: 'Mystery', icon: 'Search' }
  ];

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev?.includes(genreId)
        ? prev?.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleSubmit = () => {
    onPreferencesSubmit(selectedGenres);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-heading font-semibold text-foreground">
          What genres do you enjoy?
        </h3>
        <p className="text-muted-foreground">
          Select your favorite genres to get better recommendations (optional)
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {genres?.map((genre) => (
          <button
            key={genre?.id}
            onClick={() => toggleGenre(genre?.id)}
            className={`flex flex-col items-center space-y-2 p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedGenres?.includes(genre?.id)
                ? 'border-primary bg-primary/10 text-primary' :'border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={genre?.icon} size={24} />
            <span className="text-sm font-medium">{genre?.name}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onSkip}
          className="flex-1"
        >
          Skip for now
        </Button>
        <Button
          variant="default"
          onClick={handleSubmit}
          disabled={selectedGenres?.length === 0}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          Continue with {selectedGenres?.length} genre{selectedGenres?.length !== 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );
};

export default GenrePreferences;