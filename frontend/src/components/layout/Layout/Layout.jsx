import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Sidebar from '../Sidebar/Sidebar.jsx';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import './Layout.css';

const Layout = () => {
  const { user } = useAuth();
  const { notifications, removeNotification } = useApp();

  return (
    <div className="layout">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-container">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification notification-${notification.type}`}
              onClick={() => removeNotification(notification.id)}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <Header />
      
      {/* Main Content Area */}
      <div className="layout-body">
        {/* Sidebar for authenticated users */}
        {user && <Sidebar />}
        
        {/* Main Content */}
        <main className={`layout-main ${user ? 'with-sidebar' : ''}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
