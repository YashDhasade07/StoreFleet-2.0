import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import StoreList from '../../components/stores/StoreList/StoreList.jsx';
import { USER_ROLES } from '../../utils/constants.js';

const StoresPage = () => {
  const { user } = useAuth();

  return (
    <StoreList 
      showActions={user?.role === USER_ROLES.SYSTEM_ADMIN}
      allowRating={user?.role === USER_ROLES.NORMAL_USER}
    />
  );
};

export default StoresPage;
