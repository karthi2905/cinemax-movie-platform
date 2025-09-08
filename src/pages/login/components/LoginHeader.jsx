import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <Link to="/home-dashboard" className="inline-flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg shadow-cinematic">
          <Icon name="Film" size={28} color="white" />
        </div>
        <span className="text-2xl font-heading font-bold text-foreground">CineMax</span>
      </Link>

      {/* Welcome Text */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Welcome Back
        </h1>
        <p className="text-muted-foreground font-body">
          Sign in to continue your personalized movie journey
        </p>
      </div>
    </div>
  );
};

export default LoginHeader;