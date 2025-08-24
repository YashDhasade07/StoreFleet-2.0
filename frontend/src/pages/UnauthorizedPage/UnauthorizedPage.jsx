import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'var(--color-gray-50)'
    }}>
      <div className="card" style={{ 
        maxWidth: '500px', 
        textAlign: 'center', 
        padding: '48px 32px' 
      }}>
        {/* Error Icon */}
        <div style={{ 
          width: '80px', 
          height: '80px',
          margin: '0 auto 24px',
          backgroundColor: 'var(--color-red-light)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="var(--color-red)">
            <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
          </svg>
        </div>

        <h1 style={{ 
          color: 'var(--color-gray-700)', 
          fontSize: '24px', 
          fontWeight: '600',
          marginBottom: '16px'
        }}>
          Access Denied
        </h1>

        <p style={{ 
          color: 'var(--color-gray-600)', 
          fontSize: '16px',
          marginBottom: '8px'
        }}>
          Sorry, you don't have permission to access this page.
        </p>

        {user && (
          <p style={{ 
            color: 'var(--color-gray-500)', 
            fontSize: '14px',
            marginBottom: '32px'
          }}>
            Your current role: <strong>{user.role}</strong>
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            className="btn btn-secondary"
            onClick={handleGoBack}
          >
            Go Back
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleGoHome}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
