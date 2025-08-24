import React, { useState } from 'react';
import './StarRating.css';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  maxRating = 5, 
  size = 24,
  readonly = false,
  showValue = true 
}) => {
  const [hovered, setHovered] = useState(0);

  const handleMouseEnter = (index) => {
    if (!readonly) {
      setHovered(index);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHovered(0);
    }
  };

  const handleClick = (index) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className="star-rating">
      <div className="stars-container" style={{ fontSize: `${size}px` }}>
        {[...Array(maxRating)].map((_, index) => {
          const starIndex = index + 1;
          const isActive = starIndex <= (hovered || rating);
          
          return (
            <span
              key={starIndex}
              className={`star ${isActive ? 'star-active' : 'star-inactive'} ${readonly ? 'star-readonly' : 'star-interactive'}`}
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick(starIndex)}
              style={{ cursor: readonly ? 'default' : 'pointer' }}
            >
              <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="rating-value">
          {rating > 0 ? `${rating}/${maxRating}` : 'No rating'}
        </span>
      )}
    </div>
  );
};

export default StarRating;
