import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateAddress, 
  VALIDATION_MESSAGES 
} from '../../../utils/validation.js';
import './Register.css';

const Register = ({ onSwitchToLogin }) => {
  const { register: registerUser, loading } = useAuth();
  const { showError, showSuccess } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        address: data.address || ''
      });

      if (result.success) {
        showSuccess('Registration successful! Welcome to StoreFleet.');
        reset();
      } else {
        showError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Join StoreFleet to rate and discover amazing stores.</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name <span className="form-required">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              placeholder="Enter your full name (20-60 characters)"
              disabled={isLoading}
              {...register('name', {
                required: VALIDATION_MESSAGES.name.required,
                validate: (value) => validateName(value) || VALIDATION_MESSAGES.name.invalid
              })}
            />
            {errors.name && (
              <span className="form-error">{errors.name.message}</span>
            )}
            <span className="form-hint">Must be between 20 and 60 characters</span>
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="form-required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email address"
              disabled={isLoading}
              {...register('email', {
                required: VALIDATION_MESSAGES.email.required,
                validate: (value) => validateEmail(value) || VALIDATION_MESSAGES.email.invalid
              })}
            />
            {errors.email && (
              <span className="form-error">{errors.email.message}</span>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password <span className="form-required">*</span>
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="Create a strong password"
              disabled={isLoading}
              {...register('password', {
                required: VALIDATION_MESSAGES.password.required,
                validate: (value) => validatePassword(value) || VALIDATION_MESSAGES.password.invalid
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
            <span className="form-hint">8-16 characters with uppercase letter and special character</span>
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Address <span className="form-optional">(Optional)</span>
            </label>
            <textarea
              id="address"
              className={`form-input form-textarea ${errors.address ? 'form-input-error' : ''}`}
              placeholder="Enter your address"
              disabled={isLoading}
              rows="3"
              {...register('address', {
                validate: (value) => validateAddress(value) || VALIDATION_MESSAGES.address.invalid
              })}
            />
            {errors.address && (
              <span className="form-error">{errors.address.message}</span>
            )}
            <span className="form-hint">Maximum 400 characters</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="btn-loading">
                <div className="spinner"></div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div className="auth-switch">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={onSwitchToLogin}
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
