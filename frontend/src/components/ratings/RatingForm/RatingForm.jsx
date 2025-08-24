import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import StarRating from '../../common/StarRating/StarRating.jsx';
import storeService from '../../../services/storeService.js';
import './RatingForm.css';

const RatingForm = ({ rating, storeId, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const { showError } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  useEffect(() => {
    // Pre-fill form if editing
    if (rating) {
      setValue('message', rating.message || '');
      setSelectedRating(rating.rating);
      setValue('rating', rating.rating);
    } else {
      setValue('message', '');
      setSelectedRating(0);
      setValue('rating', 0);
    }
  }, [rating, setValue]);

  useEffect(() => {
    // Load store information if storeId is provided
    if (storeId && !rating) {
      loadStoreInfo();
    } else if (rating?.store) {
      setStore(rating.store);
    }
  }, [storeId, rating]);

  const loadStoreInfo = async () => {
    setLoadingStore(true);
    try {
      const result = await storeService.getStoreById(storeId);
      if (result.success) {
        setStore(result.data);
      } else {
        showError(result.message || 'Failed to load store information');
      }
    } catch (error) {
      showError('Error loading store: ' + error.message);
    } finally {
      setLoadingStore(false);
    }
  };

  const handleRatingChange = (newRating) => {
    setSelectedRating(newRating);
    setValue('rating', newRating);
  };

  const handleFormSubmit = async (data) => {
    if (selectedRating === 0) {
      showError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        rating: selectedRating,
        store_id: storeId || rating?.store_id
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-form">
      <div className="rating-form-header">
        <h2>{rating ? 'Edit Your Rating' : 'Rate This Store'}</h2>
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

      {/* Store Information */}
      {loadingStore ? (
        <div className="store-loading">Loading store information...</div>
      ) : store && (
        <div className="store-info">
          <h3>{store.name}</h3>
          <p>{store.address}</p>
          {store.averageRating && (
            <div className="store-current-rating">
              <StarRating rating={parseFloat(store.averageRating)} readonly showValue />
              <span>({store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
        {/* Rating Selection */}
        <div className="form-group">
          <label className="form-label">
            Your Rating <span className="form-required">*</span>
          </label>
          <div className="rating-input">
            <StarRating 
              rating={selectedRating}
              onRatingChange={handleRatingChange}
              size={32}
              showValue={false}
            />
            <span className="rating-text">
              {selectedRating === 0 && 'Select your rating'}
              {selectedRating === 1 && 'Poor'}
              {selectedRating === 2 && 'Fair'}
              {selectedRating === 3 && 'Good'}
              {selectedRating === 4 && 'Very Good'}
              {selectedRating === 5 && 'Excellent'}
            </span>
          </div>
          {errors.rating && (
            <span className="form-error">Rating is required</span>
          )}
        </div>

        {/* Message */}
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Review Message <span className="form-optional">(Optional)</span>
          </label>
          <textarea
            id="message"
            className={`form-input form-textarea ${errors.message ? 'form-input-error' : ''}`}
            placeholder="Share your experience with this store..."
            disabled={isSubmitting}
            rows="4"
            {...register('message', {
              maxLength: {
                value: 500,
                message: 'Message must not exceed 500 characters'
              }
            })}
          />
          {errors.message && (
            <span className="form-error">{errors.message.message}</span>
          )}
          <span className="form-hint">Maximum 500 characters</span>
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
            disabled={isSubmitting || selectedRating === 0}
          >
            {isSubmitting ? (
              <div className="btn-loading">
                <div className="spinner"></div>
                {rating ? 'Updating...' : 'Submitting...'}
              </div>
            ) : (
              rating ? 'Update Rating' : 'Submit Rating'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RatingForm;
