import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateAddress, 
  VALIDATION_MESSAGES 
} from '../../../utils/validation.js';
import { USER_ROLES } from '../../../utils/constants.js';
import './UserForm.css';

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  const watchedRole = watch('role');

  useEffect(() => {
    // Pre-fill form if editing
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('address', user.address || '');
      setValue('role', user.role);
    }
  }, [user, setValue]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Only include password if it's provided (for new users or password updates)
      const submitData = { ...data };
      if (!data.password) {
        delete submitData.password;
      }
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-form">
      <div className="user-form-header">
        <h2>{user ? 'Edit User' : 'Add New User'}</h2>
        <button 
          className="close-btn"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name <span className="form-required">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            placeholder="Enter full name (20-60 characters)"
            disabled={isSubmitting}
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

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="form-required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            placeholder="Enter email address"
            disabled={isSubmitting}
            {...register('email', {
              required: VALIDATION_MESSAGES.email.required,
              validate: (value) => validateEmail(value) || VALIDATION_MESSAGES.email.invalid
            })}
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </div>

        {/* Password */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password {!user && <span className="form-required">*</span>}
            {user && <span className="form-optional">(Leave blank to keep current)</span>}
          </label>
          <input
            id="password"
            type="password"
            className={`form-input ${errors.password ? 'form-input-error' : ''}`}
            placeholder={user ? "Enter new password (optional)" : "Create a strong password"}
            disabled={isSubmitting}
            {...register('password', {
              required: user ? false : VALIDATION_MESSAGES.password.required,
              validate: (value) => {
                if (!value && user) return true; // Allow empty for existing users
                return validatePassword(value) || VALIDATION_MESSAGES.password.invalid;
              }
            })}
          />
          {errors.password && (
            <span className="form-error">{errors.password.message}</span>
          )}
          <span className="form-hint">
            8-16 characters with uppercase letter and special character
          </span>
        </div>

        {/* Role */}
        <div className="form-group">
          <label htmlFor="role" className="form-label">
            User Role <span className="form-required">*</span>
          </label>
          <select
            id="role"
            className={`form-input ${errors.role ? 'form-input-error' : ''}`}
            disabled={isSubmitting}
            {...register('role', {
              required: 'User role is required'
            })}
          >
            <option value="">Select a role</option>
            <option value={USER_ROLES.NORMAL_USER}>Normal User</option>
            <option value={USER_ROLES.STORE_OWNER}>Store Owner</option>
            <option value={USER_ROLES.SYSTEM_ADMIN}>System Admin</option>
          </select>
          {errors.role && (
            <span className="form-error">{errors.role.message}</span>
          )}
          
          {/* Role Descriptions */}
          {watchedRole && (
            <div className="role-description">
              {watchedRole === USER_ROLES.NORMAL_USER && (
                <p>Can browse stores and submit ratings</p>
              )}
              {watchedRole === USER_ROLES.STORE_OWNER && (
                <p>Can manage their assigned store and view customer ratings</p>
              )}
              {watchedRole === USER_ROLES.SYSTEM_ADMIN && (
                <p>Full access to manage users, stores, and system settings</p>
              )}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Address <span className="form-optional">(Optional)</span>
          </label>
          <textarea
            id="address"
            className={`form-input form-textarea ${errors.address ? 'form-input-error' : ''}`}
            placeholder="Enter address"
            disabled={isSubmitting}
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

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="btn-loading">
                <div className="spinner"></div>
                {user ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              user ? 'Update User' : 'Create User'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
