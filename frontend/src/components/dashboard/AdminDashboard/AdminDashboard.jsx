import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';

const AdminDashboard = () => {
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
          Admin Dashboard
        </h1>
        <p style={{ color: 'var(--color-gray-600)', fontSize: '16px' }}>
          Welcome back, {user?.name}! Manage your store rating platform.
        </p>
      </div>

      {/* Dashboard Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
            Total Users
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-primary-blue)' }}>
            0
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Registered users
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
            Total Stores
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-green)' }}>
            0
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Active stores
          </p>
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
            Total Ratings
          </h3>
          <p style={{ fontSize: '28px', fontWeight: '600', color: 'var(--color-yellow)' }}>
            0
          </p>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Submitted ratings
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '16px' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">
            Add New User
          </button>
          <button className="btn btn-primary">
            Add New Store
          </button>
          <button className="btn btn-secondary">
            View All Ratings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
