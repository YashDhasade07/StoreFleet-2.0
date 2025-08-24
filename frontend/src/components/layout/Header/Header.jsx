import React from 'react';
import { useAuth } from '../../../hooks/useAuth.js';
import { useApp } from '../../../context/AppContext.jsx';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { toggleSidebar } = useApp();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* Left side - Logo and Menu */}
        <div className="header-left">
          {user && (
            <button className="menu-btn" onClick={toggleSidebar}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          )}
          
          <div className="logo">
            <h1>StoreFleet</h1>
          </div>
        </div>

        {/* Right side - User Menu */}
        {user ? (
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <div className="header-right">
            <span className="app-tagline">Store Rating Platform</span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
