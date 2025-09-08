import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import SocialLoginButton from './components/SocialLoginButton';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false
  });

  // Mock credentials for testing
  const mockCredentials = {
    email: 'user@cinemax.com',
    password: 'password123'
  };

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('cinemax_auth_token');
    if (isLoggedIn) {
      navigate('/home-dashboard');
    }
  }, [navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication logic
      if (formData?.email === mockCredentials?.email && formData?.password === mockCredentials?.password) {
        // Mock successful login
        const mockToken = 'mock_jwt_token_' + Date.now();
        const mockUser = {
          id: 1,
          email: formData?.email,
          name: 'John Doe',
          preferences: {
            theme: 'dark',
            genres: ['Action', 'Sci-Fi', 'Thriller']
          }
        };

        // Store auth data
        localStorage.setItem('cinemax_auth_token', mockToken);
        localStorage.setItem('cinemax_user', JSON.stringify(mockUser));
        
        if (formData?.rememberMe) {
          localStorage.setItem('cinemax_remember_me', 'true');
        }

        return Promise.resolve();
      } else {
        throw new Error('Invalid email or password. Please use user@cinemax.com / password123');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      // Simulate social login delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful social login
      const mockToken = `mock_${provider}_token_` + Date.now();
      const mockUser = {
        id: 2,
        email: `user@${provider}.com`,
        name: provider === 'google' ? 'Google User' : 'Facebook User',
        provider: provider,
        preferences: {
          theme: 'dark',
          genres: ['Comedy', 'Drama', 'Romance']
        }
      };

      // Store auth data
      localStorage.setItem('cinemax_auth_token', mockToken);
      localStorage.setItem('cinemax_user', JSON.stringify(mockUser));
      
      // Redirect to dashboard
      navigate('/home-dashboard');
    } catch (error) {
      console.error(`${provider} login failed:`, error);
    } finally {
      setSocialLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-cinematic p-8">
          {/* Header */}
          <LoginHeader />

          {/* Main Login Form */}
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground font-body">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Options */}
          <div className="space-y-3">
            <SocialLoginButton
              provider="google"
              onClick={() => handleSocialLogin('google')}
              disabled={socialLoading?.google || socialLoading?.facebook}
            />
            <SocialLoginButton
              provider="facebook"
              onClick={() => handleSocialLogin('facebook')}
              disabled={socialLoading?.google || socialLoading?.facebook}
            />
          </div>

          {/* Mock Credentials Info */}
          <div className="mt-6 p-3 bg-muted/20 border border-muted/30 rounded-md">
            <p className="text-xs text-muted-foreground text-center font-body">
              <strong>Demo Credentials:</strong><br />
              Email: {mockCredentials?.email}<br />
              Password: {mockCredentials?.password}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date()?.getFullYear()} CineMax. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;