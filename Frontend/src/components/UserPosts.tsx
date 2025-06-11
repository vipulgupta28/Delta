import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../context/UserContext";
import { MdOutlineComment } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import LikeComponent from "./LikeComponent";
import Navbar from "./HomeComponents/Navbar";
import DashBoardSidebar from "./DashBoardSidebar";

type Post = {
  post_id: string;
  title: string;
  headline: string;
  content: string;
  created_at: string;
  user_id: string;
};

const UserPosts: React.FC = () => {
  const { userId } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/get-userposts/${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    }
  };

  const handleLike = async (postID: string) => {
    try {
      const response = await axios.post("http://localhost:3000/api/v1/likes", {
        user_id: userId,
        post_id: postID,
      });

      if (response.status === 200) {
        toast.success("Liked");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error liking post");
    }
  };

  const toggleComments = (postId: string) => {
    setOpenCommentPostId(openCommentPostId === postId ? null : postId);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <DashBoardSidebar />

        <div className="flex-1 mt-10 px-10 ml-10 overflow-y-auto">
            <h1 className="text-3xl font-extrabold  border-b border-gray-700 pb-2">
              Your Posts
            </h1>
          <div className="flex min-h-screen bg-black text-white">
            {/* Posts Section */}
            <div className="flex-1 border border-zinc-800 p-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <div key={post.post_id} className="mb-6 p-4 border border-zinc-800 rounded-lg">
                    <h3 className="text-xl font-bold text-white">{post.title}</h3>
                    <p className="text-gray-300 mt-2">{post.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Posted on: {new Date(post.created_at).toLocaleString()}
                    </p>

                    <div className="flex items-center gap-4 mt-6">
                      {/* Like Button */}
                      <button
                        className="flex items-center justify-center p-2 rounded-full transition-colors"
                        onClick={() => handleLike(post.post_id)}
                      >
                        <LikeComponent />
                      </button>

                      {/* Comment Button */}
                      <button
                        onClick={() => toggleComments(post.post_id)}
                        className="flex items-center justify-center hover:cursor-pointer p-2 hover:bg-zinc-900 rounded-full transition-colors"
                      >
                        <MdOutlineComment className="text-zinc-200 h-5 w-5" />
                      </button>

                      {/* Share Button */}
                      <button className="flex items-center justify-center p-2 hover:cursor-pointer hover:bg-zinc-900 rounded-full transition-colors">
                        <FaShare className="text-zinc-200 h-5 w-5" />
                      </button>
                    </div>

                    {/* Comment Modal */}
                    {openCommentPostId === post.post_id && (
                      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                        <div className="bg-black border border-zinc-800 p-6 rounded-xl text-white w-full max-w-[1000px] h-[80vh] max-h-[600px] relative shadow-xl flex flex-col">
                          <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                            onClick={() => toggleComments(post.post_id)}
                          >
                            ✕
                          </button>
                          <h2 className="text-xl font-semibold mb-4">Comments</h2>
                          <div className="flex-1 overflow-y-auto">
                            <p className="text-gray-300">No comments yet...</p>
                          </div>
                          <div className="mt-4 flex gap-5 pt-4 border-t border-zinc-700">
                            <input
                              className="w-full bg-zinc-800 rounded-lg p-3 text-white focus:outline-none"
                              placeholder="Add a comment..."
                            />
                            <button className="mt-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg">
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No posts available.</p>
              )}
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPosts;
