import React from 'react';
import { Percent as Soccer } from 'lucide-react';

interface BallRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const BallRating: React.FC<BallRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  onChange,
  readOnly = false
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };
  
  const handleClick = (selectedRating: number) => {
    if (readOnly) return;
    onChange?.(selectedRating);
  };
  
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const ballValue = index + 1;
        const isFilled = ballValue <= rating;
        
        return (
          <div 
            key={index}
            className={`cursor-${readOnly ? 'default' : 'pointer'} transition-transform hover:scale-110 p-0.5`}
            onClick={() => handleClick(ballValue)}
          >
            <Soccer 
              className={`${sizeMap[size]} ${isFilled ? 'text-secondary-500' : 'text-gray-300'}`} 
              fill={isFilled ? 'currentColor' : 'none'}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BallRating;