import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import AdminDashboard from '../../components/dashboard/AdminDashboard/AdminDashboard.jsx';
import OwnerDashboard from '../../components/dashboard/OwnerDashboard/OwnerDashboard.jsx';
import UserDashboard from '../../components/dashboard/UserDashboard/UserDashboard.jsx';
import { USER_ROLES } from '../../utils/constants.js';

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case USER_ROLES.SYSTEM_ADMIN:
        return <AdminDashboard />;
      case USER_ROLES.STORE_OWNER:
        return <OwnerDashboard />;
      case USER_ROLES.NORMAL_USER:
        return <UserDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return renderDashboard();
};

export default DashboardPage;
