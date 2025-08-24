import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import { validateEmail, validatePassword, VALIDATION_MESSAGES } from '../../../utils/validation.js';
import './Login.css';

const Login = ({ onSwitchToRegister }) => {
  const { login, loading } = useAuth();
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
    console.log('Login form submitted:', data); // Debug log
    try {
      const result = await login({
        email: data.email,
        password: data.password
      });
      console.log('Login component result:', result); // Debug log
      if (result.success) {
        showSuccess('Login successful! Welcome back.');
        console.log('Login success - should redirect now'); // Debug log
        reset();
      } else {
        showError(result.message || 'Login failed. Please try again.');
        console.log('Login failed:', result.message); // Debug log
      }
    } catch (error) {
      console.error('Login component error:', error); // Debug log
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
          <h1 className="auth-title">Sign in to StoreFleet</h1>
          <p className="auth-subtitle">Welcome back! Please sign in to your account.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email"
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
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
              {...register('password', {
                required: VALIDATION_MESSAGES.password.required
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
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
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Switch to Register */}
        <div className="auth-switch">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              className="auth-switch-btn"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
