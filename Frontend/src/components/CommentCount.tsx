import { useEffect, useState } from "react";
import { CommentSection } from "./features/interactions";
import api from "../api/api";

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
      const res = await api.get(`/comments/${post.id}`);
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
