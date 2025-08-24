import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';

const OwnerDashboard = () => {
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
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px' }}>
                Average Rating
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-green)' }}>
                4.2
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Based on customer reviews
          </p>
        </div>

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
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px' }}>
                Total Reviews
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-primary-blue)' }}>
                0
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Customer feedback received
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
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '4px' }}>
                This Month
              </h3>
              <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-yellow)' }}>
                0
              </p>
            </div>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            New reviews this month
          </p>
        </div>
      </div>

      {/* Store Information Card */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            My Store Information
          </h3>
          <div style={{ 
            backgroundColor: 'var(--color-gray-50)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <p style={{ 
              color: 'var(--color-gray-600)', 
              fontSize: '14px',
              textAlign: 'center'
            }}>
              No store assigned yet. Contact your administrator to set up your store.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Store Info
            </button>
            <button className="btn btn-secondary">
              View Public Page
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              View All Reviews
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
              </svg>
              View Analytics
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reviews Section */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: 'var(--color-gray-700)' }}>
            Recent Customer Reviews
          </h3>
          <button className="btn btn-secondary">
            View All Reviews
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: 'var(--color-gray-50)',
          padding: '48px 24px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="var(--color-gray-400)" style={{ marginBottom: '16px' }}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
          <h4 style={{ color: 'var(--color-gray-600)', marginBottom: '8px' }}>
            No reviews yet
          </h4>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '14px' }}>
            When customers rate your store, their reviews will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
