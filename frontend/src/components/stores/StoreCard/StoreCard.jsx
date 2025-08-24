import React from 'react';
import { RATING_COLORS } from '../../../utils/constants.js';
import './StoreCard.css';

const StoreCard = ({ 
  store, 
  showActions = false, 
  allowRating = false, 
  onEdit, 
  onDelete, 
  onRate,        // Add this prop
  onUpdateRating, // Add this prop
  onClick 
}) => {
  const getRatingColor = (rating) => {
    const roundedRating = Math.round(rating);
    return `var(--color-${RATING_COLORS[roundedRating] || 'gray'})`;
  };

  const formatRating = (rating) => {
    return parseFloat(rating || 0).toFixed(1);
  };

  // Add these handler functions
  const handleRateStore = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('Rate Store clicked for store:', store.id); // Debug log
    if (onRate) {
      onRate(store);
    } else {
      console.error('onRate handler not provided');
    }
  };

  const handleUpdateRating = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('Update Rating clicked for store:', store.id); // Debug log
    if (onUpdateRating) {
      onUpdateRating(store);
    } else {
      console.error('onUpdateRating handler not provided');
    }
  };

  return (
    <div className="store-card" onClick={onClick}>
      {/* Store Header */}
      <div className="store-card-header">
        <div className="store-info">
          <h3 className="store-name">{store.name}</h3>
          <p className="store-address">{store.address}</p>
        </div>
        
        {store.averageRating !== undefined && (
          <div 
            className="rating-badge"
            style={{ 
              backgroundColor: getRatingColor(store.averageRating),
              color: 'white'
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {formatRating(store.averageRating)}
          </div>
        )}
      </div>

      {/* Store Details */}
      <div className="store-card-body">
        <div className="store-meta">
          <div className="store-email">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gray-500)">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            {store.email}
          </div>
          
          {store.totalRatings !== undefined && (
            <div className="rating-count">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gray-500)">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              {store.totalRatings} review{store.totalRatings !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Owner Info (Admin view) */}
        {store.owner && (
          <div className="owner-info">
            <span className="owner-label">Owner:</span>
            <span className="owner-name">{store.owner.name}</span>
          </div>
        )}

        {/* User Rating (Normal user view) */}
        {store.userRating && (
          <div className="user-rating">
            <span className="user-rating-label">Your rating:</span>
            <div className="user-rating-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={star <= store.userRating ? 'var(--color-yellow)' : 'var(--color-gray-300)'}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {(showActions || allowRating) && (
        <div className="store-card-actions" onClick={(e) => e.stopPropagation()}>
          {/* Admin Actions */}
          {showActions && (
            <>
              <button 
                className="btn btn-secondary btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(store);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button 
                className="btn btn-red btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(store.id);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </>
          )}
          
          {/* User Rating Actions */}
          {allowRating && (
            <>
              {store.userRating ? (
                <button 
                  className="btn btn-primary btn-small"
                  onClick={handleUpdateRating}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Update Rating
                </button>
              ) : (
                <button 
                  className="btn btn-primary btn-small"
                  onClick={handleRateStore}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  Rate Store
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreCard;
