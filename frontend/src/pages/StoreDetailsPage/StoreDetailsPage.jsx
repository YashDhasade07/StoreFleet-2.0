import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useApp } from '../../context/AppContext.jsx';
import storeService from '../../services/storeService.js';
import ratingService from '../../services/ratingService.js';
import RatingCard from '../../components/ratings/RatingCard/RatingCard.jsx';
import StarRating from '../../components/common/StarRating/StarRating.jsx';
import { USER_ROLES } from '../../utils/constants.js';
import './StoreDetailsPage.css';

const StoreDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const navigate = useNavigate();
  
  const [store, setStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  useEffect(() => {
    fetchStoreDetails();
  }, [id]);

  const fetchStoreDetails = async () => {
    setLoading(true);
    try {
      const result = await storeService.getStoreById(id);
      
      if (result.success) {
        setStore(result.data);
        fetchStoreRatings();
      } else {
        showError(result.message || 'Failed to load store details');
      }
    } catch (error) {
      showError('Error loading store details: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreRatings = async () => {
    setRatingsLoading(true);
    try {
      const result = await ratingService.getStoreRatings(id);
      
      if (result.success) {
        setRatings(result.data.ratings || []);
      } else {
        showError('Failed to load store ratings');
      }
    } catch (error) {
      showError('Error loading ratings: ' + error.message);
    } finally {
      setRatingsLoading(false);
    }
  };

  const handleEditStore = () => {
    if (user?.role === USER_ROLES.SYSTEM_ADMIN || user?.role === USER_ROLES.STORE_OWNER) {
      navigate('/admin/stores');
    }
  };

  const handleRateStore = () => {
    // Navigate to stores page and trigger rating modal
    navigate('/stores', { state: { rateStore: store } });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid var(--color-gray-200)',
          borderTop: '4px solid var(--color-primary-blue)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p style={{ color: 'var(--color-gray-600)' }}>Loading store details...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--color-gray-400)" style={{ marginBottom: '16px' }}>
          <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
        </svg>
        <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
          Store Not Found
        </h3>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>
          The store you're looking for doesn't exist or has been removed.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/stores')}>
          Browse All Stores
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{ 
              color: 'var(--color-gray-700)', 
              fontSize: '32px', 
              fontWeight: '600',
              marginBottom: '8px'
            }}>
              {store.name}
            </h1>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '16px', marginBottom: '8px' }}>
              {store.address}
            </p>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
              {store.email}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            {(user?.role === USER_ROLES.SYSTEM_ADMIN || user?.role === USER_ROLES.STORE_OWNER) && (
              <button className="btn btn-secondary" onClick={handleEditStore}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Manage Store
              </button>
            )}
            
            {user?.role === USER_ROLES.NORMAL_USER && (
              <button className="btn btn-primary" onClick={handleRateStore}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
                Rate This Store
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Store Stats */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--color-primary-blue)', marginBottom: '8px' }}>
            {store.averageRating ? parseFloat(store.averageRating).toFixed(1) : '0.0'}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', marginBottom: '8px' }}>
            Average Rating
          </div>
          <StarRating rating={store.averageRating ? parseFloat(store.averageRating) : 0} readonly size={18} showValue={false} />
        </div>
        
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--color-green)', marginBottom: '8px' }}>
            {store.totalRatings || 0}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
            Total Reviews
          </div>
        </div>

        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', fontWeight: '600', color: 'var(--color-orange)', marginBottom: '8px' }}>
            {store.owner?.name ? store.owner.name.split(' ')[0] : 'N/A'}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
            Store Owner
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
          Customer Reviews ({ratings.length})
        </h3>
        
        {ratingsLoading ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid var(--color-gray-200)',
              borderTop: '3px solid var(--color-primary-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px'
            }}></div>
            <p style={{ color: 'var(--color-gray-600)', fontSize: '14px' }}>Loading reviews...</p>
          </div>
        ) : ratings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {ratings.map((rating) => (
              <RatingCard
                key={rating.id}
                rating={rating}
                showActions={false}
                showStore={false}
                showUser={true}
              />
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            backgroundColor: 'var(--color-gray-50)',
            borderRadius: '8px'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-gray-400)" style={{ marginBottom: '16px' }}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <h4 style={{ color: 'var(--color-gray-600)', marginBottom: '8px' }}>
              No reviews yet
            </h4>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '14px', marginBottom: '16px' }}>
              Be the first to share your experience with this store!
            </p>
            {user?.role === USER_ROLES.NORMAL_USER && (
              <button className="btn btn-primary" onClick={handleRateStore}>
                Write First Review
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetailsPage;
