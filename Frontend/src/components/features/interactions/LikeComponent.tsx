import React, { useEffect, useState } from 'react';
import api from '../../../api/api';
import { FaHeart } from 'react-icons/fa';

interface LikeComponentProps {
  postId: string;
  userId: string;
}

const LikeComponent: React.FC<LikeComponentProps> = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const likeRes = await api.get(`/likes/${postId}`, {
          params: { user_id: userId },
        });

        const countRes = await api.get(`/likes/count/${postId}`);

        setLiked(likeRes.data.liked);
        setLikeCount(countRes.data.count);
      } catch (err) {
        console.error('Error fetching like data:', err);
      }
    };

    if (userId && postId) fetchData();
  }, [userId, postId]);

  const handleLike = async () => {
    try {
      const response = await api.post('/likes', {
        user_id: userId,
        post_id: postId,
      });

      if (response) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikeCount((prev) => prev + (newLiked ? 1 : -1));

        if (newLiked) {
          setAnimate(false); // reset
          void document.body.offsetHeight; // force reflow
          setAnimate(true); // trigger animation
          setTimeout(() => setAnimate(false), 500);
        }
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  return (
    <div
      className="relative p-3 flex items-center justify-center gap-2 rounded-full transition-all duration-100 hover:cursor-pointer"
      onClick={handleLike}
    >
      <div
        className={`relative flex flex-col items-center justify-center gap-2 rounded-full transition-transform duration-300 ${
          animate ? 'scale-125 animate-like-pop' : 'scale-100'
        }`}
      >
        {liked ? <FaHeart className="h-5 w-5" color="red" /> : <FaHeart className="h-5 w-5" />}
        <span>{likeCount}</span>
      </div>
    </div>
  );
};

export default LikeComponent;
