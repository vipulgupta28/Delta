import React, { useEffect, useState , useRef} from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, MoreVertical, Share, X,Reply } from "lucide-react";
import { FaArrowUp, FaArrowDown, FaPlay, FaPause } from 'react-icons/fa';
import api from "../../../api/api";
import toast from "react-hot-toast";
import { Flag } from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

interface Video {
  file_url: string;
  file_name: string;
  title: string;
  description: string;
  uploaded_at: string;
  id: string;
  userReaction:string;
  likes?: number;
  dislikes?: number;
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


const VideoSpace: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [showComments, setShowComments] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [nestedComments, setNestedComments] = useState<Comment[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>("");
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);  



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

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const handleTimeUpdate = () => {
    if (!isDragging) {
      const current = (video.currentTime / video.duration) * 100;
      setProgress(current || 0);
    }
  };

  video.addEventListener("timeupdate", handleTimeUpdate);
  return () => video.removeEventListener("timeupdate", handleTimeUpdate);
}, [isDragging]);

const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const video = videoRef.current;
  if (!video) return;

  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const newTime = (clickX / rect.width) * video.duration;

  video.currentTime = newTime;
};

useEffect(() => {
  setProgress(0);  // Reset bar on new video
}, [currentIndex]);

const handleMore = (commentId: string) => {
  setActiveCommentId(prevId => (prevId === commentId ? null : commentId));
};



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



useEffect(() => {
  const fetchVideos = async () => {
    try {
      const response = await api.get("/get-short-videos");
      const videoData: Video[] = response.data;

      // Fetch likes/dislikes for each video
      const videosWithStats = await Promise.all(
        videoData.map(async (video) => {
          try {
            const res = await api.get(`/shorts-reactions/summary/${video.id}`);
            return {
              ...video,
              likes: res.data.likes || 0,
              dislikes: res.data.dislikes || 0,
            };
          } catch {
            return { ...video, likes: 0, dislikes: 0 };
          }
        })
      );

      setVideos(videosWithStats);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  fetchVideos();
}, []);


  
const handleLikeDislikeforshorts = async (video_id: string, type: "like" | "dislike") => {
  try {
    const res = await api.post(`/handle-shorts-reactions/${type}`, {
      video_id,
      user_id: userId,
    });

    if (res.status === 200) {
      // Fetch updated like/dislike count for this video
      const statsRes = await api.get(`/shorts-reactions/summary/${video_id}`);
      const { likes, dislikes } = statsRes.data;
     

      // Update the current video's stats in state
      setVideos(prev =>
        prev.map(video =>
          video.id === video_id
            ? { ...video, likes: likes || 0, dislikes: dislikes || 0, userReaction: type }
            : video
        )
      );
      
    }
  } catch (error) {
    console.error(error);
    toast.error(`Failed to react`);
  }
};



  const togglePlayPause = () => {
  if (videoRef.current) {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }
};


  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setDirection("next");
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection("prev");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const slideVariants = {
    enter: (dir: "next" | "prev") => ({
      y: dir === "next" ? 600 : -600,
      opacity: 0,
      position: "absolute" as const,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
      position: "absolute" as const,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    exit: (dir: "next" | "prev") => ({
      y: dir === "next" ? -600 : 600,
      opacity: 0,
      position: "absolute" as const,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }),
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




  const handleCommentPost = async(id:string, parentId: string | null = null) =>{
      const content = parentId ? replyContent : commentContent;
  if (!content.trim()) return;

    const response = await api.post("/handle-shorts-comments",{
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
  if (!videos[currentIndex]) return;
  const currentVideoId = videos[currentIndex].id;

  setIsLoading(true);
  try {
    const response = await api.get(`/fetch-shorts-comments/${currentVideoId}`);
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
}, [currentIndex, videos]);

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
                onClick={() => handleCommentPost(videos[currentIndex].id, comment.comment_id)}
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



  

  return (
    <div className="relative flex items-center justify-center bg-black">
      <style>{`
        @keyframes exitToTop {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes exitToBottom {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes enterFromBottom {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes enterFromTop {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideIn {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }
        @keyframes slideOut {
          0% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
          
      `}</style>

      {/* Main Content */}
      <div className="relative flex justify-center items-center gap-4"
      
      >
        {/* Video Container */}
        <div className="relative w-[430px] h-[680px] bg-zinc-900 rounded-xl overflow-hidden">
          {videos.length > 0 && videos[currentIndex] ? (
            <>
              <AnimatePresence initial={false} custom={direction}>
                <motion.video
                  key={videos[currentIndex].id}
                  ref={videoRef}
                  src={videos[currentIndex].file_url}
                  className="absolute inset-0 w-full h-full object-cover"
                  onClick={togglePlayPause}
                  onLoadedMetadata={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = 0;
                    }
                  }}
                  autoPlay
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  custom={direction}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                />
              </AnimatePresence>

<div
    className="absolute bottom-0 left-0 right-0 h-2 bg-white/20 cursor-pointer z-30"
    onClick={handleSeek}
    onMouseDown={() => setIsDragging(true)}
    onMouseUp={() => setIsDragging(false)}
    onMouseLeave={() => setIsDragging(false)}
  >
    <div
      className="bg-blue-500 h-full transition-all duration-100 ease-linear"
      style={{ width: `${progress}%` }}
    />
    <div
  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full"
  style={{ left: `calc(${progress}% - 6px)` }}
/>
  </div>

  


              <div className="absolute top-2 left-2  z-20 ">
                <button
                  onClick={togglePlayPause}
                  className="bg-white/20 hover:bg-white/30 h-10 w-10 flex items-center justify-center text-white text-sm hover:cursor-pointer px-3 py-1 rounded-full"
                >
                  {isPlaying ? <FaPause size={20}/> : <FaPlay size={20}/>}
                </button>
              </div>


              {/* Video Info Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
                {/* Top Bar */}
                <div className="flex justify-end">
                  <button className="text-white p-2 rounded-full hover:bg-white/10">
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Bottom Info */}
                <div className="text-white">
                  <h2 className="text-lg font-bold mb-2">{videos[currentIndex].title}</h2>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                    {videos[currentIndex].description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {new Date(videos[currentIndex].uploaded_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-white text-xl">
              Loading videos...
            </div>
          )}
        </div>

        {/* Action Buttons (Right Side) */}
        <div className=" flex flex-col items-center gap-6 ">
          <div className="flex flex-col items-center">
          <button
    onClick={() => handleLikeDislikeforshorts(videos[currentIndex].id, "like")}
    className={`p-3 rounded-full hover:cursor-pointer transition 
      ${videos[currentIndex]?.userReaction === "like" ? "bg-white" : "bg-white/10 hover:bg-white/20"}`}
  >
    <ThumbsUp
      size={24}
      className={videos[currentIndex]?.userReaction === "like" ? "text-black" : "text-white"}
    />
  </button>

            <span className="text-xs text-white mt-1">{videos.length > 0 ? videos[currentIndex]?.likes ?? 0 : 0}</span>
          </div>

          <div className="flex flex-col items-center">

          <button
    onClick={() => handleLikeDislikeforshorts(videos[currentIndex].id, "dislike")}
    className={`p-3 rounded-full hover:cursor-pointer transition 
      ${videos[currentIndex]?.userReaction === "dislike" ? "bg-white" : "bg-white/10 hover:bg-white/20"}`}
  >
    <ThumbsDown
      size={24}
      className={videos[currentIndex]?.userReaction === "dislike" ? "text-black" : "text-white"}
    />
  </button>
            
            <span className="text-xs text-white mt-1">{videos.length > 0 ? videos[currentIndex]?.dislikes ?? 0 : 0}</span>
          </div>

          <div className="flex flex-col items-center ">
            <button 
              className="p-3 rounded-full  hover:cursor-pointer bg-white/10 hover:bg-white/20 transition"
              onClick={toggleComments}
            >
              <MessageCircle size={24} className="text-white" />
            </button>
            <span className="text-md text-white mt-1">{comments.length}</span>
          </div>

          <div className="flex flex-col items-center">
            <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition">
              <Share size={24} className="text-white" />
            </button>
            <span className="text-xs text-white mt-1">0</span>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 z-50">
        <button
          className="bg-white/30 text-white p-3 rounded-full shadow-lg hover:bg-white/40 hover:cursor-pointer transition backdrop-blur-sm"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <FaArrowUp size={25}/>
        </button>
        <button
          className="bg-white/30 text-white p-3 rounded-full shadow-lg hover:bg-white/40 hover:cursor-pointer transition backdrop-blur-sm"
          onClick={handleNext}
          disabled={currentIndex === videos.length - 1}
        >
          <FaArrowDown size={25}/>
        </button>
      </div>

      {/* Comments Modal */}
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
        handleCommentPost(videos[currentIndex].id);
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
    </div>
  );
};

export default VideoSpace;