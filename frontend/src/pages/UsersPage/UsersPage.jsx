import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import UserList from '../../components/users/UserList/UserList.jsx';
import { USER_ROLES } from '../../utils/constants.js';

const UsersPage = () => {
  const { user } = useAuth();

  // Only system admins can access user management
  if (user?.role !== USER_ROLES.SYSTEM_ADMIN) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to manage users.</p>
      </div>
    );
  }

  return <UserList showActions={true} />;
};

export default UsersPage;
