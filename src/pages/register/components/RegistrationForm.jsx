import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
    const requirements = {
      length: password?.length >= 8,
      uppercase: /[A-Z]/?.test(password),
      lowercase: /[a-z]/?.test(password),
      number: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };
    return requirements;
  };

  const getPasswordStrength = (password) => {
    const requirements = validatePassword(password);
    const score = Object.values(requirements)?.filter(Boolean)?.length;
    
    if (score < 2) return { strength: 'weak', color: 'text-error', bgColor: 'bg-error' };
    if (score < 4) return { strength: 'medium', color: 'text-warning', bgColor: 'bg-warning' };
    return { strength: 'strong', color: 'text-success', bgColor: 'bg-success' };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear errors when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else {
      const requirements = validatePassword(formData?.password);
      if (!requirements?.length || !requirements?.uppercase || !requirements?.lowercase || !requirements?.number) {
        newErrors.password = 'Password must meet all requirements';
      }
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const passwordStrength = formData?.password ? getPasswordStrength(formData?.password) : null;
  const requirements = formData?.password ? validatePassword(formData?.password) : {};

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
          className="w-full"
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          className="w-full"
        />

        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a strong password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={20} />
            </button>
          </div>

          {formData?.password && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength?.bgColor}`}
                    style={{ width: `${(Object.values(requirements)?.filter(Boolean)?.length / 5) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${passwordStrength?.color}`}>
                  {passwordStrength?.strength}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className={`flex items-center space-x-1 ${requirements?.length ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={requirements?.length ? "Check" : "X"} size={12} />
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center space-x-1 ${requirements?.uppercase ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={requirements?.uppercase ? "Check" : "X"} size={12} />
                  <span>Uppercase</span>
                </div>
                <div className={`flex items-center space-x-1 ${requirements?.lowercase ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={requirements?.lowercase ? "Check" : "X"} size={12} />
                  <span>Lowercase</span>
                </div>
                <div className={`flex items-center space-x-1 ${requirements?.number ? 'text-success' : 'text-muted-foreground'}`}>
                  <Icon name={requirements?.number ? "Check" : "X"} size={12} />
                  <span>Number</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
            className="w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <Checkbox
          label={
            <span className="text-sm text-muted-foreground">
              I agree to the{' '}
              <button type="button" className="text-primary hover:underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="text-primary hover:underline">
                Privacy Policy
              </button>
            </span>
          }
          checked={formData?.agreeToTerms}
          onChange={handleInputChange}
          name="agreeToTerms"
          error={errors?.agreeToTerms}
          required
        />

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={!formData?.agreeToTerms || isLoading}
          className="bg-primary hover:bg-primary/90"
        >
          Create Account
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;