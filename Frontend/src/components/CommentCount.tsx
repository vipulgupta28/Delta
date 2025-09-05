import { useEffect, useState } from "react";
import axios from "axios";
import { CommentSection } from "./features/interactions";

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function CommentCount({ post }: { post: Post }) {
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      const res = await axios.get(`http://localhost:3000/api/v1/comments/${post.id}`);
      setCommentCount(res.data.length);
    };
    fetchCount();
  }, [post.id]);

  return (
    <div className="post">
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      <button onClick={() => setShowComments(true)}>
        💬 {commentCount} Comments
      </button>

      {showComments && (
        <CommentSection
          postID={post.id}
        />
      )}
    </div>
  );
}
