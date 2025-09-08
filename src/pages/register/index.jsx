import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import SocialRegistration from './components/SocialRegistration';
import GenrePreferences from './components/GenrePreferences';

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // Mock user data for demonstration
  const mockUsers = [
    { email: "john.doe@example.com", password: "Password123!" },
    { email: "jane.smith@example.com", password: "SecurePass456!" },
    { email: "admin@cinemax.com", password: "Admin789!" }
  ];

  const handleRegistration = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check if email already exists
      const existingUser = mockUsers?.find(user => user?.email === formData?.email);
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Store registration data and show preferences
      setRegistrationData(formData);
      setShowPreferences(true);
      
    } catch (error) {
      alert(error?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegistration = async (provider) => {
    setIsLoading(true);
    
    try {
      // Simulate social registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful social registration
      const mockSocialData = {
        fullName: provider === 'google' ? 'Google User' : 'Facebook User',
        email: `${provider}user@example.com`,
        provider: provider
      };
      
      setRegistrationData(mockSocialData);
      setShowPreferences(true);
      
    } catch (error) {
      alert(`${provider} registration failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async (selectedGenres) => {
    setIsLoading(true);
    
    try {
      // Simulate saving preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to home dashboard
      navigate('/home-dashboard');
      
    } catch (error) {
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipPreferences = () => {
    navigate('/home-dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Create Account - CineMax</title>
        <meta name="description" content="Join CineMax and discover personalized movie recommendations tailored to your taste. Create your account and start your cinematic journey today." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16 pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-md mx-auto">
              {!showPreferences ? (
                <div className="bg-card rounded-lg shadow-cinematic border border-border p-6 md:p-8">
                  {/* Header */}
                  <div className="text-center space-y-2 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                      <Icon name="UserPlus" size={32} className="text-primary" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">
                      Create Your Account
                    </h1>
                    <p className="text-muted-foreground">
                      Join CineMax and discover movies you'll love
                    </p>
                  </div>

                  {/* Registration Form */}
                  <div className="space-y-6">
                    <RegistrationForm 
                      onSubmit={handleRegistration}
                      isLoading={isLoading}
                    />

                    <SocialRegistration 
                      onSocialRegister={handleSocialRegistration}
                    />
                  </div>

                  {/* Login Link */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        className="text-primary hover:underline font-medium transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg shadow-cinematic border border-border p-6 md:p-8">
                  {/* Welcome Message */}
                  <div className="text-center space-y-2 mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mx-auto mb-4">
                      <Icon name="CheckCircle" size={32} className="text-success" />
                    </div>
                    <h1 className="text-2xl font-heading font-bold text-foreground">
                      Welcome to CineMax!
                    </h1>
                    <p className="text-muted-foreground">
                      Account created successfully for{' '}
                      <span className="text-foreground font-medium">
                        {registrationData?.fullName}
                      </span>
                    </p>
                  </div>

                  {/* Genre Preferences */}
                  <GenrePreferences 
                    onPreferencesSubmit={handlePreferencesSubmit}
                    onSkip={handleSkipPreferences}
                  />
                </div>
              )}

              {/* Features Preview */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto">
                    <Icon name="Sparkles" size={20} className="text-primary" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    Personalized
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    AI-powered recommendations
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto">
                    <Icon name="Star" size={20} className="text-accent" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    Rate & Review
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Share your movie opinions
                  </p>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mx-auto">
                    <Icon name="Bookmark" size={20} className="text-success" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    Watchlist
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Save movies for later
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Register;