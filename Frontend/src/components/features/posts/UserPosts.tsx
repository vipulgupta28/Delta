import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdOutlineComment } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { LikeComponent } from "../interactions";
import {CommentSection} from "../interactions";
import { motion, AnimatePresence } from "framer-motion";

type Post = {
  post_id: string;
  title: string;
  headline: string;
  content: string;
  created_at: string;
  user_id: string;
  username:string
};

interface UserPostsProps {
  userId: string ;
}

const UserPosts: React.FC<UserPostsProps> = ({ userId }) => {
  
  const [posts, setPosts] = useState<Post[]>([]); 
  const [comments, setComments] = useState(false);
  const [selectedPostID, setSelectedPostID] = useState<string | null>(null);

  const toggleComments = (postID: string) =>{

    setSelectedPostID(postID);
    setComments(!comments);
  
  
  }
  

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


  return (
    <div className="bg-black text-white min-h-screen">
      <div className=" mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Your Posts</h1>
          <p className="text-gray-400 mt-2">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </header>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article 
                key={post.post_id} 
                className="bg-black rounded-xl p-6 border border-zinc-800  transition-colors"
              >
                 <div className="flex items-center gap-3 mb-4">
                  <img 
                    src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg" 
                    className="h-10 w-10 rounded-full" 
                    alt="User avatar" 
                  />
                  <div>
                    <h3 className="font-semibold hover:underline cursor-pointer">
                      {post.username}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {new Date(post.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4 whitespace-pre-line">{post.content}</p>


                <div className="flex items-center gap-4 mt-6 pt-4 ">
                  <button
                    onClick={() => handleLike(post.post_id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <LikeComponent  postId={post.post_id} userId={userId} />
                   
                  </button>

                  <button
                     onClick={() => toggleComments(post.post_id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <MdOutlineComment className="h-5 w-5" />
                    <span>Comments</span>
                  </button>

                  <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <FaShare className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Comment Modal */}
                
                <AnimatePresence>
  {comments && selectedPostID && (
    <>
      <motion.div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setComments(false)}
      />

      <motion.div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <CommentSection
          postID={selectedPostID}
        
        />
      </motion.div>
    </>
  )}
</AnimatePresence>
              </article>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">You haven't created any posts yet.</p>
           
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPosts;