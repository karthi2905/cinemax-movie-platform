import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import HomeDashboard from './pages/home-dashboard';
import MovieBrowse from './pages/movie-browse';
import SearchResults from './pages/search-results';
import Login from './pages/login';
import MovieDetails from './pages/movie-details';
import Register from './pages/register';
import Recommendations from './pages/Recommendations';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HomeDashboard />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/movie-browse" element={<MovieBrowse />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movie-details/:id" element={<MovieDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
