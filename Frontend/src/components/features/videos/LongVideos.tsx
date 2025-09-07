import { useEffect, useState } from "react";

import CustomVideoPlayer from "./CustomVideoPlayer";
import { ThumbsUp, ThumbsDown, Reply, MessageCircle,MoreVertical,X } from "lucide-react";
import api from "../../../api/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { Flag } from "lucide-react";
import moment from "moment";

interface Video {
  file_url: string;
  file_name: string;
  title: string;
  description: string;
  uploaded_at: string;
  id: string;
  likes?: number;
  dislikes?: number;
  user_liked?: boolean;
  user_disliked?: boolean;
}



interface Comment {
  comment_id: string;
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  profiles: {
    profile_img: string;
  };
  replies?: Comment[];
  parent_comment_id?: string | null;
  like_count: number;
  dislike_count: number;
  user_liked?: boolean;    
  user_disliked?: boolean;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};


const LongVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");


  const handleMore = (commentId: string) => {
    setActiveCommentId(prevId => (prevId === commentId ? null : commentId));
  };

  const toggleReplies = (commentId: string) => {
    setOpenReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleComments = () => {
    if (showComments) {
      setIsAnimatingOut(true);
  
      setTimeout(() => {
        setShowComments(false);
        setIsAnimatingOut(false);
      }, 300); 
    } else {
      setShowComments(true);
    }
  };



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


  const handleLikeDislike = async (commentId: string, type: "like" | "dislike") => {
    try {
      const res = await api.post(`/comment/${type}`, {
        comment_id: commentId,
        user_id: userId,  
      });
  
      if (res.status === 200) {
        fetchComments(); 
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${type} comment`);
    }
  };



  const handleLikeDislikeforLongVideos = async (video_id: string, type: "like" | "dislike") => {
    try {
      const res = await api.post(`/handle-long-video-reactions/${type}`, {
        video_id,
        user_id: userId,
      });
  
      if (res.status === 200) {
        const statsRes = await api.get(`/long-videos-reactions/summary/${video_id}`);
        const { likes, dislikes, user_liked, user_disliked } = statsRes.data;
  
        // Update video list
        setVideos(prev =>
          prev.map(video =>
            video.id === video_id
              ? { ...video, likes, dislikes, user_liked, user_disliked }
              : video
          )
        );
  
        // Update selected video if open
        if (selectedVideo?.id === video_id) {
          setSelectedVideo({
            ...selectedVideo,
            likes,
            dislikes,
            user_liked,
            user_disliked
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to react`);
    }
  };
  




  const handleCommentPost = async(id:string, parentId: string | null = null) =>{
    const content = parentId ? replyContent : commentContent;
if (!content.trim()) return;

  const response = await api.post("/handle-long-comments",{
      content: content,
      username:username,
      user_id:userId,
      video_id:id,
      parent_comment_id: parentId || null
    
  })

  if (response.status === 200) {
    toast.success("Comment posted!");
    if (parentId) {
      setReplyContent("");
      setReplyingTo(null);
    } else {
      setCommentContent("");
    }
    fetchComments();
  }
  if(response.status == 500){
    toast.error("error posting");
  }
}


const fetchComments = async () => {
if (!selectedVideo) return;
const currentVideoId = selectedVideo.id;

setIsLoading(true);
try {
  const response = await api.get(`/fetch-long-comments/${currentVideoId}`);
 const flat = response.data;
  const nested = nestComments(flat);
  setComments(flat);
  setNestedComments(nested);
} catch (error) {
  console.error(error);
  toast.error("Failed to load comments");
} finally {
  setIsLoading(false);
}
};


useEffect(() => {
setComments([]);
if (videos.length > 0) {
  fetchComments();
}
}, [selectedVideo, videos]);

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


const renderComments = (commentList: Comment[], level: number = 0) =>
commentList.map((comment) => (
  <div key={comment.comment_id} style={{ marginLeft: level * 20 }} className="mb-10 pl-3 pr-5">
    <div className="flex gap-3">
      <img src={comment.profiles.profile_img} className="h-14 w-14 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-white">{comment.username}</p>
          <span className="text-xs text-[#60A5FA]">{moment(comment.created_at).fromNow()}</span>
          <AnimatePresence>
          {activeCommentId === comment.comment_id && (
<motion.div
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={dropdownVariants}
  className="absolute right-15 mt-20 bg-black text-white border border-zinc-700 rounded-xl shadow-lg w-44 z-50 overflow-hidden"
>
  <button className="w-full flex items-center gap-3 hover:cursor-pointer text-left px-4 py-3 hover:bg-zinc-800 text-sm transition-all">
    <Flag size={15} />
    Report
  </button>
</motion.div>
)}

  </AnimatePresence>
          <button
           onClick={() => handleMore(comment.comment_id)}
           className="ml-auto p-3 rounded-full animation duration-4 hover:cursor-pointer hover:bg-zinc-700 text-gray-400">
            <MoreVertical size={16} />
          </button>
        </div>
        <p className="text-gray-300">{comment.content}</p>

        <div className="flex items-center mt-4 space-x-6 text-sm">
          <button
          
          onClick={() => handleLikeDislike(comment.comment_id, "like")}
           className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"><ThumbsUp size={20} /></button>

          <button
          onClick={() => handleLikeDislike(comment.comment_id, "dislike")}
           className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"><ThumbsDown size={20} /></button>

          <button
            onClick={() => setReplyingTo(comment.comment_id)}
            className="text-gray-400 hover:text-blue-500 hover:cursor-pointer"
          >
            <Reply size={20} className="mr-1" />
          </button>
        </div>

        {/* Reply Input */}
        {replyingTo === comment.comment_id && (
          <div className="mt-2 ">
            <input
              type="text"
              placeholder="Write a reply..."
              className="bg-zinc-800 text-white px-3 py-2 rounded-full w-full mt-2"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex gap-5 mt-2">

            <button
              onClick={() => handleCommentPost(selectedVideo?.id||"", comment.comment_id)}
              className="bg-white hover:cursor-pointer text-black px-3 py-1 rounded-full mt-2"
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
          </div>
        )}

        {/* View Replies Button */}
        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => toggleReplies(comment.comment_id)}
            className="mt-5 hover:cursor-pointer text-md text-blue-400 hover:underline"
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















  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await api.get("/get-videos");
        const rawVideos: Video[] = response.data;
    
        // Now fetch reactions for each video in parallel
        const videosWithReactions = await Promise.all(
          rawVideos.map(async (video) => {
            try {
              const statsRes = await api.get(
                `/long-videos-reactions/summary/${video.id}?user_id=${userId}`
              );
              const { likes, dislikes, user_liked, user_disliked } = statsRes.data;
              return {
                ...video,
                likes,
                dislikes,
                user_liked,
                user_disliked,
              };
            } catch (err) {
              console.error("Reaction fetch failed for video", video.id);
              return video; // fallback to raw data if summary fails
            }
          })
        );
    
        setVideos(videosWithReactions);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchVideos();
  }, []);

  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderShortDescription = (text: string, limit: number = 200) => {
    if (!text) return "No description available.";
    if (text.length <= limit || showFullDesc) return text;
    return text.substring(0, limit) + "...";
  };

  if (loading)
    return <div className="p-4 text-center text-white">Loading videos...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500 text-center bg-gray-800 rounded">
        {error}
      </div>
    );
  if (videos.length === 0)
    return <div className="p-4 text-center text-white">No videos found</div>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      {selectedVideo ? (
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => {
              setSelectedVideo(null);
              setShowFullDesc(false);
            }}
            className="mb-4 text-blue-400 hover:underline"
          >
            ← Back to video list
          </button>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video player */}
            <div className="w-full lg:w-2/3">
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <CustomVideoPlayer src={selectedVideo.file_url} />
              </div>
              <h1 className="text-2xl font-bold mt-4">{selectedVideo.title}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Uploaded on {formatDate(selectedVideo.uploaded_at)}
              </p>

              <div className="flex gap-4 mt-4">

                <button
                  onClick={() => handleLikeDislikeforLongVideos(selectedVideo.id, "like")}
                 className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                   <ThumbsUp size={18} /> {selectedVideo.likes || 0}
                </button>

                <button
                onClick={() => handleLikeDislikeforLongVideos(selectedVideo.id, "dislike")}
                 className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                  <ThumbsDown size={18} /> {selectedVideo.dislikes || 0}
                </button>

                <button className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                  <Reply size={18} /> Share
                </button>

                <button
                onClick={toggleComments}
                 className="flex items-center hover:cursor-pointer gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                  <MessageCircle size={18} /> {comments.length}
                </button>

              </div>

              <p className="mt-4 text-gray-300 leading-relaxed">
                {renderShortDescription(selectedVideo.description)}
                {selectedVideo.description?.length > 200 && (
                  <span
                    className="text-blue-400 ml-2 cursor-pointer hover:underline"
                    onClick={() => setShowFullDesc(!showFullDesc)}
                  >
                    {showFullDesc ? "Show Less" : "Show More"}
                  </span>
                )}
              </p>
            </div>

            {showComments && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="bg-black/50 w-full h-full absolute"
            onClick={toggleComments}
          />
       <div className={`relative w-full max-w-2xl h-full bg-zinc-900 flex flex-col ${isAnimatingOut ? 'animate-slide-out' : 'animate-slide-in'}`}>


            <div className="sticky top-0 bg-zinc-900 p-4 flex justify-between items-center border-b border-zinc-700">
              <h3 className="text-xl font-bold text-white">Comments (<span className=" p-1">{comments.length}</span>)</h3>
              <button 
                className="text-white p-2 rounded-full hover:cursor-pointer hover:bg-white/10"
                onClick={toggleComments}
              >
                <X size={24} />
              </button>
            </div>

             <div className="flex-1 custom-scrollbar overflow-y-auto pr-2 space-y-10 pt-5 pb-5">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400 ">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            renderComments(nestedComments)
          )}
        </div>

            

      {/* Comment Input */}
  <div className="sticky bottom-0 left-0 w-full bg-zinc-900 p-4 border-t border-zinc-800 z-10">
  {videos.length > 0 && (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCommentPost(selectedVideo.id);
      }}
      className="flex gap-2"
    >
    
      <input
        type="text"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-zinc-800 text-white px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white/20"
      />
      <button
        type="submit"
        className="bg-white text-black px-4 py-2 hover:cursor-pointer rounded-full font-medium disabled:opacity-50"
        disabled={!commentContent.trim()}
      >
        Post
      </button>
    </form>
  )}
</div>

            
          </div>
            
        </div>
      )}

            {/* Related videos */}
            <div className="w-full lg:w-1/3 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Related Videos</h2>
              {videos
                .filter((v) => v.file_url !== selectedVideo.file_url)
                .slice(0, 6)
                .map((video, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedVideo(video);
                      setShowFullDesc(false);
                    }}
                    className="flex gap-3 cursor-pointer hover:bg-zinc-900 p-2 rounded-lg transition"
                  >
                    <div className="w-40 h-24 rounded overflow-hidden">
                      <video
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                        playsInline
                      >
                        <source
                          src={video.file_url}
                          type={`video/${video.file_name.split(".").pop()}`}
                        />
                      </video>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium line-clamp-2 text-sm">
                        {video.title}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDate(video.uploaded_at)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        // Video Grid
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">
            An educated citizenry is a vital requisite for our survival as a free people.
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden hover:bg-zinc-800 transition cursor-pointer shadow-md"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="aspect-video bg-black">
                  <video
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                    playsInline
                  >
                    <source
                      src={video.file_url}
                      type={`video/${video.file_name.split(".").pop()}`}
                    />
                  </video>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white line-clamp-2">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Uploaded: {formatDate(video.uploaded_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LongVideos;
