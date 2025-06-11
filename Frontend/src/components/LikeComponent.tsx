import React, { useState } from 'react';
import Heart from '../assets/heart.png'; // your heart sprite (28 frames)

const LikeComponent: React.FC = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  
  };

  return (
    <>
      <div
        className="relative p-3 flex items-center justify-center rounded-full  transition-all duration-100 bg-[rgba(255,192,200,0)]"
        onClick={toggleLike}
      >
        <div
          className={`absolute w-[70px] h-[70px] bg-no-repeat bg-[length:1960px_70px] cursor-pointer ${
            liked ? 'animate-like' : ''
          }`}
          style={{ backgroundImage: `url(${Heart})` }}
        />
      </div>

      {/* Inline animation keyframes */}
      <style>
        {`
          @keyframes like-anim {
  to {
    background-position: right;
  }
}


          .animate-like {
            animation: like-anim 0.7s steps(28) forwards;
          }
        `}
      </style>
    </>
  );
};

export default LikeComponent;
