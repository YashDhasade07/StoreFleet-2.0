import React from 'react';
import StarRating from '../../common/StarRating/StarRating.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { USER_ROLES } from '../../../utils/constants.js';
import './RatingCard.css';

const RatingCard = ({ 
  rating, 
  showActions = false, 
  showStore = false, 
  showUser = false, 
  onEdit, 
  onDelete 
}) => {
  const { user } = useAuth();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canEdit = () => {
    return user?.role === USER_ROLES.SYSTEM_ADMIN || 
           (user?.role === USER_ROLES.NORMAL_USER && user?.id === rating.user_id);
  };

  const canDelete = () => {
    return user?.role === USER_ROLES.SYSTEM_ADMIN || 
           (user?.role === USER_ROLES.NORMAL_USER && user?.id === rating.user_id);
  };

  return (
    <div className="rating-card">
      {/* Rating Header */}
      <div className="rating-card-header">
        <div className="rating-info">
          <StarRating rating={rating.rating} readonly size={20} showValue={false} />
          <span className="rating-date">{formatDate(rating.created_at)}</span>
        </div>
        
        {rating.updated_at && rating.updated_at !== rating.created_at && (
          <span className="rating-edited">Edited</span>
        )}
      </div>

      {/* Store Information */}
      {showStore && rating.store && (
        <div className="store-info">
          <div className="store-details">
            <h4 className="store-name">{rating.store.name}</h4>
            <p className="store-address">{rating.store.address}</p>
          </div>
        </div>
      )}

      {/* User Information */}
      {showUser && rating.user && (
        <div className="user-info">
          <div className="user-avatar">
            {rating.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{rating.user.name}</span>
            <span className="user-email">{rating.user.email}</span>
          </div>
        </div>
      )}

      {/* Rating Message */}
      {rating.message && (
        <div className="rating-message">
          <p>{rating.message}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && (canEdit() || canDelete()) && (
        <div className="rating-card-actions">
          {canEdit() && (
            <button 
              className="btn btn-secondary btn-small"
              onClick={() => onEdit(rating)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit
            </button>
          )}
          
          {canDelete() && (
            <button 
              className="btn btn-red btn-small"
              onClick={() => onDelete(rating.id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RatingCard;
