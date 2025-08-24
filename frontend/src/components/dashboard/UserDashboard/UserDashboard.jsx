import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          color: 'var(--color-gray-700)', 
          fontSize: '32px', 
          fontWeight: '600',
          marginBottom: '8px'
        }}>
          User Dashboard
        </h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '16px' }}>
          Welcome back, {user?.name}! Discover and rate amazing stores in your area.
        </p>
      </div>

      {/* User Activity Cards */}
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
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px' }}>
                My Ratings
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-primary-blue)' }}>
                0
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Total stores you've rated
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
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px' }}>
                Favorite Stores
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-green)' }}>
                0
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            5-star rated stores
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--color-orange-light)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '16px'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--color-orange)">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px' }}>
                This Month
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-orange)' }}>
                0
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            New ratings submitted
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Discover Stores Section */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: 'var(--color-gray-700)' }}>
              Discover New Stores
            </h3>
            <button className="btn btn-primary">
              Browse All Stores
            </button>
          </div>
          
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
              Ready to explore?
            </h4>
            <p style={{ color: 'var(--color-gray-500)', fontSize: '14px', marginBottom: '16px' }}>
              Find amazing local stores and share your experience with others.
            </p>
            <button className="btn btn-primary">
              Start Exploring
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              Search Stores
            </button>
            
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              My Reviews
            </button>
            
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Top Rated Stores
            </button>
            
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'var(--color-gray-700)' }}>
            Recent Activity
          </h3>
          <button className="btn btn-secondary">
            View All Activity
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--color-gray-50)',
          padding: '48px 24px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-gray-400)" style={{ marginBottom: '16px' }}>
            <path d="M13,2.05V5.08C16.39,5.57 19,8.47 19,12C19,12.9 18.82,13.75 18.5,14.54L21.12,16.07C21.68,14.83 22,13.45 22,12C22,6.82 18.05,2.55 13,2.05M12,19A7,7 0 0,1 5,12C5,8.47 7.61,5.57 11,5.08V2.05C5.95,2.55 2,6.82 2,12A10,10 0 0,0 12,22C15.3,22 18.23,20.39 20.05,17.91L17.45,16.38C16.17,18 14.21,19 12,19Z"/>
          </svg>
          <h4 style={{ color: 'var(--color-gray-600)', marginBottom: '8px' }}>
            No recent activity
          </h4>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
            Start rating stores to see your activity here.
          </p>
        </div>
      </div>

      {/* Tips Section */}
      <div className="card" style={{ 
        padding: '24px', 
        backgroundColor: 'var(--color-primary-blue)', 
        color: 'white',
        marginTop: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            borderRadius: '50%',
            padding: '12px',
            flexShrink: 0
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5A1.5,1.5 0 0,1 10.5,9A1.5,1.5 0 0,1 12,7.5A1.5,1.5 0 0,1 13.5,9A1.5,1.5 0 0,1 12,10.5Z"/>
            </svg>
          </div>
          <div>
            <h3 style={{ color: 'white', marginBottom: '12px' }}>
              💡 Pro Tip
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', lineHeight: '1.5' }}>
              Help other customers by writing detailed reviews! Share what you loved about the store's service, 
              products, or atmosphere. Your honest feedback helps build a better community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
