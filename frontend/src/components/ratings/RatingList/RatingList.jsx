import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import ratingService from '../../../services/ratingService.js';
import adminService from '../../../services/adminService.js';
import RatingCard from '../RatingCard/RatingCard.jsx';
import RatingForm from '../RatingForm/RatingForm.jsx';
import { USER_ROLES } from '../../../utils/constants.js';
import './RatingList.css';

const RatingList = ({ 
  storeId, 
  userId, 
  showActions = true, 
  showStore = false, 
  showUser = false 
}) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRating, setEditingRating] = useState(null);
  const [filters, setFilters] = useState({
    rating: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  useEffect(() => {
    fetchRatings();
  }, [pagination.currentPage, filters, storeId, userId]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      let result;

      if (user?.role === USER_ROLES.SYSTEM_ADMIN) {
        // Admin can see all ratings
        result = await adminService.getAllRatingsAdmin({
          store_id: storeId,
          user_id: userId,
          rating: filters.rating,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        });
      } else if (storeId) {
        // Get ratings for specific store
        result = await ratingService.getStoreRatings(storeId, {
          rating: filters.rating,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        });
      } else if (user?.role === USER_ROLES.NORMAL_USER) {
        // Get user's own ratings
        result = await ratingService.getMyRatings({
          rating: filters.rating,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: pagination.currentPage,
          limit: pagination.itemsPerPage
        });
      }

      if (result?.success) {
        setRatings(result.data.ratings || []);
        setPagination(prev => ({
          ...prev,
          totalPages: result.data.pagination?.totalPages || 1,
          totalItems: result.data.pagination?.totalItems || 0
        }));
      } else {
        showError(result?.message || 'Failed to load ratings');
      }
    } catch (error) {
      showError('Error loading ratings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRating = () => {
    setEditingRating(null);
    setShowForm(true);
  };

  const handleEditRating = (rating) => {
    setEditingRating(rating);
    setShowForm(true);
  };

  const handleDeleteRating = async (ratingId) => {
    if (!window.confirm('Are you sure you want to delete this rating? This action cannot be undone.')) {
      return;
    }

    try {
      const result = await ratingService.deleteRating(ratingId);
      if (result.success) {
        showSuccess('Rating deleted successfully');
        fetchRatings();
      } else {
        showError(result.message || 'Failed to delete rating');
      }
    } catch (error) {
      showError('Error deleting rating: ' + error.message);
    }
  };

  const handleFormSubmit = async (ratingData) => {
    try {
      let result;
      
      if (editingRating) {
        result = await ratingService.updateRating(editingRating.id, ratingData);
      } else {
        result = await ratingService.submitRating(ratingData);
      }

      if (result.success) {
        showSuccess(`Rating ${editingRating ? 'updated' : 'submitted'} successfully`);
        setShowForm(false);
        setEditingRating(null);
        fetchRatings();
      } else {
        showError(result.message || `Failed to ${editingRating ? 'update' : 'submit'} rating`);
      }
    } catch (error) {
      showError(`Error ${editingRating ? 'updating' : 'submitting'} rating: ` + error.message);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const getPageTitle = () => {
    if (user?.role === USER_ROLES.SYSTEM_ADMIN) {
      return 'All Ratings';
    } else if (storeId) {
      return 'Store Ratings';
    } else {
      return 'My Ratings';
    }
  };

  return (
    <div className="rating-list-container">
      {/* Header */}
      <div className="rating-list-header">
        <div>
          <h1 className="rating-list-title">{getPageTitle()}</h1>
          <p className="rating-list-subtitle">
            {user?.role === USER_ROLES.SYSTEM_ADMIN 
              ? 'Manage all ratings in the system'
              : storeId 
                ? 'See what customers are saying'
                : 'Your submitted store ratings'
            }
          </p>
        </div>
        
        {showActions && !storeId && user?.role === USER_ROLES.NORMAL_USER && (
          <button className="btn btn-primary" onClick={handleAddRating}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add Rating
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-row">
          <select 
            value={filters.rating} 
            onChange={(e) => handleFilterChange('rating', e.target.value)}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <select 
            value={filters.sortBy} 
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="created_at">Sort by Date</option>
            <option value="rating">Sort by Rating</option>
          </select>
          
          <select 
            value={filters.sortOrder} 
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="filter-select"
          >
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading ratings...</p>
        </div>
      )}

      {/* Ratings List */}
      {!loading && (
        <>
          {ratings.length > 0 ? (
            <>
              <div className="rating-grid">
                {ratings.map((rating) => (
                  <RatingCard
                    key={rating.id}
                    rating={rating}
                    showActions={showActions}
                    showStore={showStore}
                    showUser={showUser}
                    onEdit={() => handleEditRating(rating)}
                    onDelete={() => handleDeleteRating(rating.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {pagination.currentPage} of {pagination.totalPages} 
                    ({pagination.totalItems} total ratings)
                  </span>
                  
                  <button
                    className="btn btn-secondary"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--color-gray-400)">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <h3>No ratings found</h3>
              <p>
                {storeId 
                  ? 'This store has no ratings yet. Be the first to rate it!'
                  : 'You haven\'t rated any stores yet.'
                }
              </p>
              {!storeId && user?.role === USER_ROLES.NORMAL_USER && (
                <button className="btn btn-primary" onClick={handleAddRating}>
                  Rate Your First Store
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Rating Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <RatingForm
              rating={editingRating}
              storeId={storeId}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingRating(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingList;
