import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { validateEmail, validateAddress, VALIDATION_MESSAGES } from '../../../utils/validation.js';
import userService from '../../../services/userService.js';
import './StoreForm.css';

const StoreForm = ({ store, onSubmit, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storeOwners, setStoreOwners] = useState([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    // Pre-fill form if editing
    if (store) {
      setValue('name', store.name);
      setValue('email', store.email);
      setValue('address', store.address);
      setValue('owner_id', store.owner_id || store.owner?.id);
    }

    // Load store owners
    loadStoreOwners();
  }, [store, setValue]);

  const loadStoreOwners = async () => {
    setLoadingOwners(true);
    try {
      const result = await userService.getAllUsers({ 
        role: 'store_owner',
        limit: 100 // Get all store owners
      });
      if (result.success) {
        setStoreOwners(result.data.users || []);
      }
    } catch (error) {
      console.error('Error loading store owners:', error);
    } finally {
      setLoadingOwners(false);
    }
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="store-form">
      <div className="store-form-header">
        <h2>{store ? 'Edit Store' : 'Add New Store'}</h2>
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
        {/* Store Name */}
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Store Name <span className="form-required">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'form-input-error' : ''}`}
            placeholder="Enter store name"
            disabled={isSubmitting}
            {...register('name', {
              required: 'Store name is required',
              minLength: {
                value: 2,
                message: 'Store name must be at least 2 characters'
              },
              maxLength: {
                value: 100,
                message: 'Store name must not exceed 100 characters'
              }
            })}
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        {/* Store Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="form-required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`form-input ${errors.email ? 'form-input-error' : ''}`}
            placeholder="Enter store email"
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

        {/* Store Address */}
        <div className="form-group">
          <label htmlFor="address" className="form-label">
            Address <span className="form-required">*</span>
          </label>
          <textarea
            id="address"
            className={`form-input form-textarea ${errors.address ? 'form-input-error' : ''}`}
            placeholder="Enter store address"
            disabled={isSubmitting}
            rows="3"
            {...register('address', {
              required: 'Address is required',
              validate: (value) => validateAddress(value) || VALIDATION_MESSAGES.address.invalid
            })}
          />
          {errors.address && (
            <span className="form-error">{errors.address.message}</span>
          )}
          <span className="form-hint">Maximum 400 characters</span>
        </div>

        {/* Store Owner */}
        <div className="form-group">
          <label htmlFor="owner_id" className="form-label">
            Store Owner <span className="form-required">*</span>
          </label>
          {loadingOwners ? (
            <div className="loading-owners">Loading store owners...</div>
          ) : (
            <select
              id="owner_id"
              className={`form-input ${errors.owner_id ? 'form-input-error' : ''}`}
              disabled={isSubmitting}
              {...register('owner_id', {
                required: 'Store owner is required'
              })}
            >
              <option value="">Select a store owner</option>
              {storeOwners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          )}
          {errors.owner_id && (
            <span className="form-error">{errors.owner_id.message}</span>
          )}
          {storeOwners.length === 0 && !loadingOwners && (
            <span className="form-hint">
              No store owners found. Create store owner users first.
            </span>
          )}
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
            disabled={isSubmitting || loadingOwners}
          >
            {isSubmitting ? (
              <div className="btn-loading">
                <div className="spinner"></div>
                {store ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              store ? 'Update Store' : 'Create Store'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreForm;
