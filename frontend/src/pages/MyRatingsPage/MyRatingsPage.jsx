import React from 'react';
import RatingList from '../../components/ratings/RatingList/RatingList.jsx';

const MyRatingsPage = () => {
  return (
    <RatingList 
      showActions={true}
      showStore={true}
      showUser={false}
    />
  );
};

export default MyRatingsPage;
