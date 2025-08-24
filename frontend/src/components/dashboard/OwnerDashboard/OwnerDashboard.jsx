import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import storeService from '../../../services/storeService.js';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useApp();
  const navigate = useNavigate();
  
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalRatings: 0,
    averageRating: 0
  });

  useEffect(() => {
    fetchMyStores();
  }, []);

  const fetchMyStores = async () => {
    setLoading(true);
    try {
      console.log('Fetching stores for owner...');
      const result = await storeService.getMyStores();
      
      if (result.success) {
        console.log('Stores received:', result.data);
        setStores(result.data.stores || []);
        
        // Calculate overall stats
        const totalRatings = result.data.stores.reduce((sum, store) => sum + store.totalRatings, 0);
        const totalRatingSum = result.data.stores.reduce((sum, store) => 
          sum + (store.averageRating * store.totalRatings), 0);
        const overallAverage = totalRatings > 0 ? (totalRatingSum / totalRatings) : 0;
        
        setStats({
          totalStores: result.data.totalStores || 0,
          totalRatings,
          averageRating: overallAverage
        });
      } else {
        console.error('Failed to fetch stores:', result.message);
        showError(result.message || 'Failed to load your stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      showError('Error loading your dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewStore = (store) => {
    navigate(`/stores/${store.id}`);
  };

  const handleEditStore = (store) => {
    navigate(`/admin/stores`); // Navigate to store management
  };

  const handleViewRatings = (store) => {
    navigate(`/store/${store.id}/ratings`); // Navigate to store-specific ratings
  };

  const handleViewAllRatings = () => {
    navigate('/admin/ratings');
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          color: 'var(--color-gray-700)', 
          fontSize: '32px', 
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          Store Owner Dashboard
        </h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '16px' }}>
          Welcome back, {user?.name}! Monitor your store performance and customer feedback.
        </p>
      </div>

      {/* Store Performance Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-primary-blue)',
              opacity: '0.1',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-primary-blue)">
                <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px', fontSize: '14px' }}>
                My Stores
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-primary-blue)', margin: 0 }}>
                {loading ? '...' : stats.totalStores}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', margin: 0 }}>
            Total stores you manage
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-green-light)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-green)">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px', fontSize: '14px' }}>
                Average Rating
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-green)', margin: 0 }}>
                {loading ? '...' : stats.averageRating.toFixed(1)}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', margin: 0 }}>
            Overall customer satisfaction
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-yellow-light)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-yellow)">
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px', fontSize: '14px' }}>
                Total Reviews
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-yellow)', margin: 0 }}>
                {loading ? '...' : stats.totalRatings}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', margin: 0 }}>
            Customer feedback received
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            My Stores
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
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
          ) : stores.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stores.map((store) => (
                <div key={store.id} style={{
                  padding: '16px',
                  backgroundColor: 'var(--color-gray-50)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-gray-700)' }}>
                        {store.name}
                      </h4>
                      <p style={{ margin: '0 0 8px 0', color: 'var(--color-gray-500)', fontSize: '14px' }}>
                        {store.address}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--color-yellow)">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                          <span style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
                            {store.averageRating.toFixed(1)} ({store.totalRatings} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => handleViewStore(store)}
                      >
                        View
                      </button>
                      <button 
                        className="btn btn-primary btn-small"
                        onClick={() => handleViewRatings(store)}
                      >
                        Ratings
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              backgroundColor: 'var(--color-gray-50)',
              padding: '48px 24px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-gray-400)" style={{ marginBottom: '16px' }}>
                <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
              </svg>
              <h4 style={{ color: 'var(--color-gray-600)', marginBottom: '8px' }}>
                No stores assigned
              </h4>
              <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
                Contact your administrator to get stores assigned to you.
              </p>
            </div>
          )}
        </div>

        {/* <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              className="btn btn-primary" 
              style={{ justifyContent: 'flex-start' }}
              onClick={handleViewAllRatings}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              View All Ratings
            </button>
            
            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'flex-start' }}
              onClick={handleEditStore}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Manage Stores
            </button>
            
            <button 
              className="btn btn-secondary" 
              style={{ justifyContent: 'flex-start' }}
              onClick={handleUpdateProfile}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Update Profile
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default OwnerDashboard;
