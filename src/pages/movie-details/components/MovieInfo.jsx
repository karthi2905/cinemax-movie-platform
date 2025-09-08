import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MovieInfo = ({ movie }) => {
  return (
    <div className="px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Cast & Crew */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Cast & Crew
            </h2>
            
            {/* Director */}
            <div className="space-y-3">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Director
              </h3>
              <div className="flex items-center space-x-3">
                <Image
                  src={movie?.director?.image}
                  alt={movie?.director?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-body font-semibold text-foreground">
                    {movie?.director?.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-body">
                    Director
                  </p>
                </div>
              </div>
            </div>

            {/* Main Cast */}
            <div className="space-y-3">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Main Cast
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {movie?.cast?.slice(0, 6)?.map((actor, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Image
                      src={actor?.image}
                      alt={actor?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-body font-semibold text-foreground truncate">
                        {actor?.name}
                      </p>
                      <p className="text-sm text-muted-foreground font-body truncate">
                        {actor?.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              Movie Details
            </h2>
            
            <div className="space-y-4">
              {/* Release Information */}
              <div className="flex items-start space-x-3">
                <Icon name="Calendar" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <p className="font-body font-semibold text-foreground">Release Date</p>
                  <p className="text-muted-foreground font-body">{movie?.releaseDate}</p>
                </div>
              </div>

              {/* Runtime */}
              <div className="flex items-start space-x-3">
                <Icon name="Clock" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <p className="font-body font-semibold text-foreground">Runtime</p>
                  <p className="text-muted-foreground font-body">{movie?.runtime} minutes</p>
                </div>
              </div>

              {/* Language */}
              <div className="flex items-start space-x-3">
                <Icon name="Globe" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <p className="font-body font-semibold text-foreground">Language</p>
                  <p className="text-muted-foreground font-body">{movie?.language}</p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-start space-x-3">
                <Icon name="DollarSign" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <p className="font-body font-semibold text-foreground">Budget</p>
                  <p className="text-muted-foreground font-body">{movie?.budget}</p>
                </div>
              </div>

              {/* Box Office */}
              <div className="flex items-start space-x-3">
                <Icon name="TrendingUp" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <p className="font-body font-semibold text-foreground">Box Office</p>
                  <p className="text-muted-foreground font-body">{movie?.boxOffice}</p>
                </div>
              </div>

              {/* Production Companies */}
              <div className="flex items-start space-x-3">
                <Icon name="Building" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <p className="font-body font-semibold text-foreground">Production</p>
                  <p className="text-muted-foreground font-body">
                    {movie?.productionCompanies?.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Rating Distribution
              </h3>
              <div className="space-y-2">
                {movie?.ratingDistribution?.map((rating, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm font-body text-foreground">{rating?.stars}</span>
                      <Icon name="Star" size={12} color="var(--color-accent)" />
                    </div>
                    <div className="flex-1 bg-muted/20 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${rating?.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-body text-muted-foreground w-12 text-right">
                      {rating?.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;