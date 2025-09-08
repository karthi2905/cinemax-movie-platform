import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isActive = (path) => location?.pathname === path;

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      window.location.href = `/search-results?q=${encodeURIComponent(searchQuery?.trim())}`;
    }
  };

  const handleSearchExpand = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchCollapse = () => {
    setIsSearchExpanded(false);
    setSearchQuery('');
  };

  const navigationItems = [
    { label: 'Home', path: '/home-dashboard', icon: 'Home' },
    { label: 'Browse', path: '/movie-browse', icon: 'Film' },
    { label: 'Search', path: '/search-results', icon: 'Search' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo */}
        <Link to="/home-dashboard" className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
            <Icon name="Film" size={20} color="white" />
          </div>
          <span className="text-xl font-heading font-bold text-foreground">CineMax</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-body font-semibold transition-colors duration-200 ease-cinematic ${
                isActive(item?.path)
                  ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted/10'
              }`}
            >
              <Icon name={item?.icon} size={16} />
              <span>{item?.label}</span>
            </Link>
          ))}
        </nav>

        {/* Search and User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Search */}
          <div className="hidden md:block relative">
            {!isSearchExpanded ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchExpand}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="Search" size={20} />
              </Button>
            ) : (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-64 pr-10"
                    autoFocus
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleSearchCollapse}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => window.location.href = '/search-results'}
          >
            <Icon name="Search" size={20} />
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="User" size={20} />
            </Button>

            {isUserMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-90"
                  onClick={() => setIsUserMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-md shadow-cinematic z-100">
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted/10 transition-colors duration-200">
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted/10 transition-colors duration-200">
                      Watchlist
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted/10 transition-colors duration-200">
                      Settings
                    </button>
                    <hr className="my-2 border-border" />
                    <Link
                      to="/login"
                      className="block w-full px-4 py-2 text-left text-sm text-popover-foreground hover:bg-muted/10 transition-colors duration-200"
                    >
                      Sign Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-100 bg-background/95 backdrop-blur-sm border-t border-border">
        <nav className="flex items-center justify-around h-16 px-4">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors duration-200 ease-cinematic ${
                isActive(item?.path)
                  ? 'text-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="text-xs font-caption">{item?.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;