import React from 'react';
import Button from '../../../components/ui/Button';


const SocialLoginButton = ({ provider, onClick, disabled = false }) => {
  const getProviderConfig = (provider) => {
    switch (provider) {
      case 'google':
        return {
          icon: 'Chrome',
          label: 'Continue with Google',
          bgColor: 'bg-white hover:bg-gray-50',
          textColor: 'text-gray-900',
          borderColor: 'border-gray-300'
        };
      case 'facebook':
        return {
          icon: 'Facebook',
          label: 'Continue with Facebook',
          bgColor: 'bg-blue-600 hover:bg-blue-700',
          textColor: 'text-white',
          borderColor: 'border-blue-600'
        };
      default:
        return {
          icon: 'User',
          label: 'Continue',
          bgColor: 'bg-muted hover:bg-muted/80',
          textColor: 'text-foreground',
          borderColor: 'border-border'
        };
    }
  };

  const config = getProviderConfig(provider);

  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      fullWidth
      className={`${config?.bgColor} ${config?.textColor} ${config?.borderColor} border transition-colors duration-200`}
      iconName={config?.icon}
      iconPosition="left"
      iconSize={20}
    >
      {config?.label}
    </Button>
  );
};

export default SocialLoginButton;