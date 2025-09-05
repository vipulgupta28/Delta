import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-hot-toast";
import { ThumbsUp, ThumbsDown, Reply, MoreVertical } from "lucide-react";
import { MdOutlineComment } from "react-icons/md";
import moment from "moment"; // Add moment.js for date formatting

interface Comment {
  comment_id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  parent_comment_id?: string | null;
  profiles: {
    profile_img: string;
  };
  replies?: Comment[];
}


interface Props {
  postID: string;
  
}

const CommentSection: React.FC<Props> = ({ postID }) => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
 const [open, setOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
const [replyContent, setReplyContent] = useState<string>("");
const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});

const toggleComments = () =>{
  setOpen(!open)
}



  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me"); 
        const user = res.data.user;
        setUsername(user.username);
        setUserId(user.user_id);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const toggleReplies = (commentId: string) => {
  setOpenReplies(prev => ({
    ...prev,
    [commentId]: !prev[commentId],
  }));
};


  const fetchComments = async () => {
  setIsLoading(true);
  try {
    const response = await api.get(`/comments/${postID}`);
    const flat = response.data;
    const nested = nestComments(flat);
    setComments(flat);

    setNestedComments(nested);
  } catch (error) {
    toast.error("Failed to load comments");
  } finally {
    setIsLoading(false);
  }
};

 const handleComment = async (parentId: string | null = null) => {
  const content = parentId ? replyContent : commentContent;
  if (!content.trim()) return;

  try {
    const response = await api.post(`/comment/${postID}`, {
      commentContent: content,
      user_id: userId,
      username: username,
      parent_comment_id: parentId || null
    });

    if (response) {
      toast.success("Comment posted!");
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setCommentContent("");
      }
      fetchComments();
    }
  } catch (error) {
    toast.error("Error posting comment");
  }
};


  useEffect(() => {
    setComments([]);
    fetchComments();
  }, [postID]);


  function nestComments(comments: Comment[]): Comment[] {
  const map = new Map<string, any>();
  const roots: Comment[] = [];

  comments.forEach(c => map.set(c.comment_id, { ...c, replies: [] }));

  comments.forEach(c => {
    if (c.parent_comment_id) {
      const parent = map.get(c.parent_comment_id);
      if (parent) parent.replies.push(map.get(c.comment_id));
    } else {
      roots.push(map.get(c.comment_id));
    }
  });

  return roots;
}


const renderComments = (commentList: Comment[], level: number = 0)=>
  commentList.map((comment) => (
    <div key={comment.comment_id} style={{ marginLeft: level * 20 }} className="mb-8 mr-5">
      <div className="flex gap-3">
        <img src={comment.profiles.profile_img} className="h-15 w-15 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-white">{comment.username}</p>
            <span className="text-xs text-[#60A5FA]">{moment(comment.created_at).fromNow()}</span>
            <button className="ml-auto text-gray-400 hover:text-gray-300">
              <MoreVertical size={16} />
            </button>
          </div>
          <p className="text-gray-300">{comment.content}</p>

          <div className="flex items-center mt-5 space-x-10 text-sm">
            <button className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"><ThumbsUp size={20} /></button>
            <button className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"><ThumbsDown size={20} /></button>
            <button
              onClick={() => setReplyingTo(comment.comment_id)}
              className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"
            >
              <Reply size={20} className="mr-1" />
            </button>
          </div>

          {/* Reply Input */}
          {replyingTo === comment.comment_id && (
            <div className="mt-2 flex gap-3">
              <input
                type="text"
                placeholder="Write a reply..."
                className="bg-zinc-800 text-white px-3 py-2 rounded-full w-full mt-2"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button
                onClick={() => handleComment(comment.comment_id)}
                className="bg-white text-black hover:cursor-pointer px-3 py-1 rounded-full mt-2"
              >
                Reply
              </button>
               <button
  onClick={() => {
    setReplyingTo(null);
    setReplyContent(""); // optional: also clear the typed reply
  }}
  className="bg-white hover:cursor-pointer text-black px-3 py-1 rounded-full mt-2"
>
  Cancel
</button>
            </div>
          )}

          {/* View Replies Button */}
          {comment.replies && comment.replies.length > 0 && (
            <button
              onClick={() => toggleReplies(comment.comment_id)}
              className="mt-4 hover:cursor-pointer text-md text-blue-400 hover:underline"
            >
              {openReplies[comment.comment_id] ? "Hide Replies" : `View Replies (${comment.replies.length})`}
            </button>
          )}

          {/* Render Nested Replies */}
          {openReplies[comment.comment_id] && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {renderComments(comment.replies, level + 1)}
            </div>
          )}
        </div>
      </div>
    </div>
  ));




  return (
<>
<button
                    onClick={() => toggleComments()}
                    className="flex items-center justify-center hover:cursor-pointer gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <div 
                     className="relative p-3 flex flex-col items-center justify-center gap-2 rounded-full transition-all duration-100 bg-[rgba(255,192,200,0)]">
                    <MdOutlineComment className="h-5 w-5" />
              
                    <span>{comments.length}</span>
                    </div>
                  </button>


{open &&
(

  
  <div className="fixed inset-0 z-30 bg-black/80 bg-blur-sm flex items-center justify-center p-4 ">
  <div className="bg-[#121212] border border-zinc-800 p-6 rounded-lg text-white w-full max-w-6xl h-[85vh] max-h-[800px] relative shadow-xl flex flex-col">
    <button
      className="absolute top-4 right-4 hover:cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
      onClick={()=>toggleComments()}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
    </div>

    <div className="flex-1 overflow-y-auto pr-2 space-y-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        renderComments(nestedComments)

      )}
    </div>

    <div className="mt-6 pt-4  ">
      <div className="flex gap-3 ">
        
          <input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
             className="flex-1 w-full bg-zinc-800 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Write a comment..."
            onKeyPress={(e) => e.key === 'Enter' && handleComment()}
          />
          <button
            onClick={()=>handleComment}
            disabled={!commentContent.trim()}
            className="bg-white text-black px-4 py-2 hover:cursor-pointer rounded-full font-medium disabled:opacity-50"
          >
            Post
          </button>
      
      </div>
    </div>
  </div>
</div>

)}


    </>
  );
};

export default CommentSection;