import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto remove notification
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Show success message
  const showSuccess = (message) => {
    addNotification({ type: 'success', message });
  };

  // Show error message
  const showError = (message) => {
    addNotification({ type: 'error', message });
  };

  // Show warning message
  const showWarning = (message) => {
    addNotification({ type: 'warning', message });
  };

  // Show info message
  const showInfo = (message) => {
    addNotification({ type: 'info', message });
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const contextValue = {
    // State
    notifications,
    sidebarOpen,
    theme,
    
    // Actions
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toggleSidebar,
    setSidebarOpen,
    setTheme
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;
