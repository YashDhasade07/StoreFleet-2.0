import React from 'react';
import { USER_ROLES } from '../../../utils/constants.js';
import './UserCard.css';

const UserCard = ({ user, showActions = false, onEdit, onDelete, onClick }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.SYSTEM_ADMIN:
        return 'var(--color-red)';
      case USER_ROLES.STORE_OWNER:
        return 'var(--color-primary-blue)';
      case USER_ROLES.NORMAL_USER:
        return 'var(--color-green)';
      default:
        return 'var(--color-gray-500)';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case USER_ROLES.SYSTEM_ADMIN:
        return 'System Admin';
      case USER_ROLES.STORE_OWNER:
        return 'Store Owner';
      case USER_ROLES.NORMAL_USER:
        return 'Normal User';
      default:
        return role;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="user-card" onClick={onClick}>
      {/* User Header */}
      <div className="user-card-header">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-email">{user.email}</p>
        </div>
        <div 
          className="role-badge"
          style={{ 
            backgroundColor: getRoleColor(user.role),
            color: 'white'
          }}
        >
          {getRoleLabel(user.role)}
        </div>
      </div>

      {/* User Details */}
      <div className="user-card-body">
        {user.address && (
          <div className="user-address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gray-500)">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {user.address}
          </div>
        )}
        
        <div className="user-meta">
          <div className="created-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gray-500)">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H3V8h14v12z"/>
            </svg>
            Joined {formatDate(user.created_at)}
          </div>
        </div>

        {/* Store Owner Info */}
        {user.role === USER_ROLES.STORE_OWNER && user.ownedStores && (
          <div className="owned-stores">
            <span className="stores-label">Stores:</span>
            {user.ownedStores.length > 0 ? (
              <div className="stores-list">
                {user.ownedStores.map(store => (
                  <div key={store.id} className="store-item">
                    <span className="store-name">{store.name}</span>
                    {store.averageRating && (
                      <span className="store-rating">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--color-yellow)">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        {parseFloat(store.averageRating).toFixed(1)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <span className="no-stores">No stores assigned</span>
            )}
          </div>
        )}

        {/* Normal User Info */}
        {user.role === USER_ROLES.NORMAL_USER && user.submittedRatings && (
          <div className="user-ratings">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gray-500)">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            {user.submittedRatings.length} rating{user.submittedRatings.length !== 1 ? 's' : ''} submitted
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="user-card-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="btn btn-secondary btn-small"
            onClick={() => onEdit(user)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            Edit
          </button>
          <button 
            className="btn btn-red btn-small"
            onClick={() => onDelete(user.id)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
