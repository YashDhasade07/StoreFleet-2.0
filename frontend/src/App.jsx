import React from 'react';
import { useAuth } from './hooks/useAuth.js';
import { useApp } from './context/AppContext.jsx';
import AuthContainer from './components/auth/AuthContainer/AuthContainer.jsx';
import './index.css';

function App() {
  const { user, loading, isLoggedIn, logout, isAdmin, isStoreOwner, isNormalUser } = useAuth();
  const { notifications, removeNotification } = useApp();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show auth forms if not logged in
  if (!isLoggedIn()) {
    return (
      <>
        {/* Notifications */}
        {notifications.length > 0 && (
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            width: '320px'
          }}>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification notification-${notification.type}`}
                onClick={() => removeNotification(notification.id)}
                style={{ cursor: 'pointer' }}
              >
                {notification.message}
              </div>
            ))}
          </div>
        )}
        
        <AuthContainer />
      </>
    );
  }

  // Show logged in user dashboard
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-gray-50)', padding: '20px' }}>
      {/* Notifications */}
      {notifications.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          width: '320px'
        }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification notification-${notification.type}`}
              onClick={() => removeNotification(notification.id)}
              style={{ cursor: 'pointer' }}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '32px' }}>
        <h1 style={{ color: 'var(--color-primary-blue)', fontSize: '32px', fontWeight: '600', marginBottom: '16px' }}>
          Welcome to StoreFleet! 🎉
        </h1>
        
        {/* User Info */}
        <div className="bg-green-light" style={{ padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <h3 style={{ color: 'var(--color-green)', marginBottom: '8px' }}>
            ✅ Successfully logged in as: {user?.name}
          </h3>
          <p style={{ color: 'var(--color-green)', fontSize: '14px', margin: 0 }}>
            Role: {user?.role}
            {isAdmin() && ' (System Administrator)'}
            {isStoreOwner() && ' (Store Owner)'}
            {isNormalUser() && ' (Normal User)'}
          </p>
        </div>
        
        <button className="btn btn-secondary" onClick={logout}>
          Logout
        </button>

        <div style={{ 
          padding: '16px',
          backgroundColor: 'var(--color-gray-100)',
          borderRadius: '8px',
          border: '1px solid var(--color-gray-200)',
          marginTop: '24px'
        }}>
          <h3 style={{ color: 'var(--color-gray-700)', marginBottom: '8px' }}>
            Next Steps:
          </h3>
          <ul style={{ color: 'var(--color-gray-600)', paddingLeft: '20px' }}>
            <li>✅ Authentication Context (COMPLETED)</li>
            <li>✅ Login/Register Components (COMPLETED)</li>
            <li>🔄 Protected Routes</li>
            <li>🔄 Dashboard Components</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
