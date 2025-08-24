import React from 'react';
import { useAuth } from '../../hooks/useAuth.js';
import RatingList from '../../components/ratings/RatingList/RatingList.jsx';
import { USER_ROLES } from '../../utils/constants.js';

const RatingsPage = () => {
  const { user } = useAuth();

  return (
    <RatingList 
      showActions={true}
      showStore={user?.role === USER_ROLES.NORMAL_USER}
      showUser={user?.role === USER_ROLES.SYSTEM_ADMIN}
    />
  );
};

export default RatingsPage;
