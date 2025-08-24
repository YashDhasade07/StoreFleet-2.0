import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useApp } from '../../context/AppContext.jsx';
import storeService from '../../services/storeService.js';
import ratingService from '../../services/ratingService.js';

const MyStorePage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const navigate = useNavigate();
  
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingsLoading, setRatingsLoading] = useState(false);

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    setLoading(true);
    try {
      const result = await storeService.getMyStores();
      
      if (result.success) {
        setStores(result.data.stores || []);
        // Auto-select first store if available
        if (result.data.stores && result.data.stores.length > 0) {
          setSelectedStore(result.data.stores[0]);
          fetchStoreRatings(result.data.stores[0].id);
        }
      } else {
        showError(result.message || 'Failed to load your stores');
      }
    } catch (error) {
      showError('Error loading your stores: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStoreRatings = async (storeId) => {
    setRatingsLoading(true);
    try {
      const result = await ratingService.getStoreRatings(storeId);
      
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

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    fetchStoreRatings(store.id);
  };

  const handleEditStore = () => {
    if (selectedStore) {
      navigate(`/admin/stores`); // Navigate to store management
    }
  };

  const handleViewAllRatings = () => {
    navigate('/admin/ratings');
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
        <p style={{ color: 'var(--color-gray-600)' }}>Loading your stores...</p>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="var(--color-gray-400)" style={{ marginBottom: '16px' }}>
          <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
        </svg>
        <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
          No Stores Assigned
        </h3>
        <p style={{ color: 'var(--color-gray-500)', marginBottom: '24px' }}>
          Contact your administrator to get stores assigned to you.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          color: 'var(--color-gray-700)', 
          fontSize: '32px', 
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          My Store
        </h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '16px' }}>
          Manage your store and monitor customer feedback
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '300px 1fr',
        gap: '24px',
        minHeight: '500px'
      }}>
        {/* Store Selection Sidebar */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            Your Stores ({stores.length})
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stores.map((store) => (
              <div
                key={store.id}
                style={{
                  padding: '16px',
                  backgroundColor: selectedStore?.id === store.id ? 'var(--color-primary-blue)' : 'var(--color-gray-50)',
                  color: selectedStore?.id === store.id ? 'white' : 'var(--color-gray-700)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: selectedStore?.id === store.id ? '2px solid var(--color-primary-blue)' : '1px solid var(--color-gray-200)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleStoreSelect(store)}
              >
                <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>
                  {store.name}
                </h4>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', opacity: '0.8' }}>
                  {store.address}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    <span style={{ fontSize: '12px' }}>
                      {store.averageRating ? store.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', opacity: '0.7' }}>
                    ({store.totalRatings || 0} reviews)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedStore && (
            <>
              {/* Store Info Card */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
                      {selectedStore.name}
                    </h2>
                    <p style={{ color: 'var(--color-gray-600)', marginBottom: '8px' }}>
                      {selectedStore.address}
                    </p>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
                      {selectedStore.email}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-secondary" onClick={handleEditStore}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Edit Store
                    </button>
                    <button className="btn btn-primary" onClick={handleViewAllRatings}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                      View All Ratings
                    </button>
                  </div>
                </div>

                {/* Store Stats */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-gray-50)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary-blue)', marginBottom: '4px' }}>
                      {selectedStore.averageRating ? selectedStore.averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                      Average Rating
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'var(--color-gray-50)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-green)', marginBottom: '4px' }}>
                      {selectedStore.totalRatings || 0}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                      Total Reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Ratings */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
                  Recent Customer Feedback
                </h3>
                
                {ratingsLoading ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      border: '3px solid var(--color-gray-200)',
                      borderTop: '3px solid var(--color-primary-blue)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 12px'
                    }}></div>
                    <p style={{ color: 'var(--color-gray-600)', fontSize: '14px' }}>Loading ratings...</p>
                  </div>
                ) : ratings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto' }}>
                    {ratings.slice(0, 10).map((rating) => (
                      <div key={rating.id} style={{
                        padding: '16px',
                        backgroundColor: 'var(--color-gray-50)',
                        borderRadius: '8px',
                        border: '1px solid var(--color-gray-200)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {[1, 2, 3, 4, 5].map(star => (
                                <svg
                                  key={star}
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill={star <= rating.rating ? 'var(--color-yellow)' : 'var(--color-gray-300)'}
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                              ))}
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-gray-700)' }}>
                              {rating.user?.name || 'Anonymous'}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                            {new Date(rating.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        {rating.message && (
                          <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-gray-600)', lineHeight: '1.4' }}>
                            "{rating.message}"
                          </p>
                        )}
                      </div>
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
                      No ratings yet
                    </h4>
                    <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
                      Customer ratings will appear here once people start reviewing your store.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyStorePage;
