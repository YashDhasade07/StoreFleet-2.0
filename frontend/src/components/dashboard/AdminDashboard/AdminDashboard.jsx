import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import adminService from '../../../services/adminService.js';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { showError } = useApp();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
    averageRating: '0.0',
    roleDistribution: [],
    recentActivity: {
      users: 0,
      stores: 0,
      ratings: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      console.log('Fetching dashboard stats...');
      const result = await adminService.getDashboardStats();
      
      if (result.success) {
        console.log('Dashboard stats received:', result.data);
        setStats(result.data);
      } else {
        console.error('Failed to fetch dashboard stats:', result.message);
        showError(result.message || 'Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      showError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate('/admin/users');
  };

  const handleAddStore = () => {
    navigate('/admin/stores');
  };

  const handleViewRatings = () => {
    navigate('/admin/ratings');
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
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '16px' }}>
          Welcome back, {user?.name}! Here's what's happening with your platform.
        </p>
      </div>

      {/* Main Stats Cards */}
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
                <path d="M16 7c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5 5-2.24 5-5zM12 14c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px', fontSize: '14px' }}>
                Total Users
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-primary-blue)', margin: 0 }}>
                {loading ? '...' : stats.totalUsers}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', margin: 0 }}>
            Registered users (+{loading ? '...' : stats.recentActivity.users} this month)
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
                <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px', fontSize: '14px' }}>
                Total Stores
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-green)', margin: 0 }}>
                {loading ? '...' : stats.totalStores}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', margin: 0 }}>
            Active stores (+{loading ? '...' : stats.recentActivity.stores} this month)
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
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px', fontSize: '14px' }}>
                Total Ratings
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-yellow)', margin: 0 }}>
                {loading ? '...' : stats.totalRatings}
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)', margin: 0 }}>
            Submitted ratings (avg: {loading ? '...' : stats.averageRating}/5)
          </p>
        </div>
      </div>

      {/* Role Distribution */}
      {!loading && stats.roleDistribution.length > 0 && (
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            User Role Distribution
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {stats.roleDistribution.map((role, index) => (
              <div key={index} style={{
                padding: '8px 16px',
                backgroundColor: 'var(--color-gray-100)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-gray-700)' }}>
                  {role.role.replace('_', ' ').toUpperCase()}
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--color-white)', 
                  backgroundColor: 'var(--color-primary-blue)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {role.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handleAddUser}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New User
          </button>
          <button className="btn btn-primary" onClick={handleAddStore}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Add New Store
          </button>
          <button className="btn btn-secondary" onClick={handleViewRatings}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            View All Ratings
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid var(--color-gray-200)',
              borderTop: '4px solid var(--color-primary-blue)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: 'var(--color-gray-600)' }}>Loading dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
