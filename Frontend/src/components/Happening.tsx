import { useState, useEffect } from "react";
import Navbar from "./HomeComponents/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./HomeComponents/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { MdOutlineComment } from "react-icons/md";
import { FaShare } from "react-icons/fa";

import LikeComponent from "./LikeComponent";

type Post = {
  post_id: string;
  title:string;
  headline: string;
  content: string;
  created_at: string;
  user_id: string;
  username:string;
};

const Happening: React.FC = () => {
  const [isVisible, setisVisible] = useState(false);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");

  const [posts,setPosts] = useState<Post[]>([]);

  
 
 const {userId} = useUser();
 const {username} = useUser();

 console.log(username)

  

  const createPost = () => {
    setisVisible(true);
  };

  const StorePosts = async () => {
 
    const response = await axios.post("http://localhost:3000/api/v1/store-posts",{
        headline: headline,
        content:content,
        user_id: userId,
        username:username
    });

    if(response.status === 200){
        console.log("Post uploaded")
    }
  }


  useEffect(()=>{
    fetchPosts();
  },[])




  const fetchPosts = async () => {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/get-posts");
    setPosts(response.data); 
    console.log(response.data)

  } catch (error) {
    console.error("Error fetching posts:", error);
    toast.error("Failed to fetch posts");
  }
}
  


const handleLike = async(postID:string) =>{

  const response = await axios.post("http://localhost:3000/api/v1/likes",{
    user_id: userId,
    post_id: postID,

  })
   if(response.status === 200){
      toast.success("liked")
    }
    else{
      toast.error("errror");
    }

}


const [comments, setComments] = useState(false);

const toggleComments = () =>{

  setComments(!comments);


}

// const handleShare = () =>{

// }
    

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-60 mt-10 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 mt-10 px-10 ml-10 overflow-y-auto">
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight border-b border-gray-700 pb-2">
              What's Happening
            </h1>

            <div className="flex justify-end">
              <button
                onClick={createPost}
                className="flex bg-white p-4 text-black rounded-[50px] font-medium hover:cursor-pointer"
              >
                Create Post
              </button>
            </div>

        

            {/* Modal */}
            <AnimatePresence>
              {isVisible && (
                <>
                  {/* Background Blur */}
                  <motion.div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setisVisible(false)}
                  />

                  {/* Modal Content */}
                  <motion.div
                    className="fixed top-2/3 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-xl text-center"
                    initial={{ opacity: 0, scale: 0.9, y: "-50%" }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="bg-neutral-900 text-white p-6 rounded-2xl shadow-xl border border-neutral-700 text-center">
                      <h2 className="text-xl font-semibold mb-4">
                        Share News With the World
                      </h2>
                      <form className="space-y-0">
                        <input
                          type="text"
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="News headline"
                          className="w-full bg-neutral-800 text-white placeholder-gray-400 px-4 py-4 border-b focus:outline-none focus:ring-1 focus:ring-white"
                        />
                        <textarea
                          rows={5}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="What's the story?"
                          className="w-full bg-neutral-800 text-white placeholder-gray-400 px-4 py-4 h-60 resize-none focus:outline-none focus:ring-1 focus:ring-white"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-3">
                            {/* Icons */}
                            <label className="cursor-pointer">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M3 16l4-4a3 3 0 014 0l4 4M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <input type="file" accept="image/*" className="hidden" />
                            </label>
                            <label className="cursor-pointer">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
                              </svg>
                              <input type="file" accept="video/*" className="hidden" />
                            </label>
                          </div>
                          <button
                            type="submit"
                            onClick={StorePosts}
                            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-neutral-200 transition"
                          >
                            Post
                          </button>

                          <button
                            type="submit"
                            onClick={StorePosts}
                            className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-neutral-200 transition"
                          >
                            Post Anonymously
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

              <div className="flex min-h-screen bg-black text-white">
  {/* Posts Section */}
  <div className="flex-1 border-l border-r border-zinc-800 p-6">
    {posts.length > 0 ? (
      posts.map((post) => (
        <div key={post.post_id} className="mb-6 p-4 border border-zinc-800 rounded-lg">
          <div className="flex gap-2 pb-5"> 
              <img src={"https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg"} className="h-8 w-8 rounded-full" alt="" />

                <h3 className="text-xl font-bold text-white hover:cursor-pointer hover:underline">{post.username}</h3>
          </div>
        
          <h3 className="text-[15px] font-bold text-white">{post.title}</h3>
          <p className="text-gray-300 mt-2">{post.content}</p>
          <p className="text-sm text-gray-500 mt-2">
            Posted on: {new Date(post.created_at).toLocaleString()}
          </p>
        <div className="flex items-center gap-4 mt-6">
  {/* Like Button */}
  <button
    className="flex items-center justify-center p-2  rounded-full transition-colors"
    onClick={() => handleLike(post.post_id)}
  >
    <LikeComponent />
  </button>

  {/* Comment Button */}
  <button
  onClick={toggleComments}
   className="flex items-center justify-center hover:cursor-pointer p-2 hover:bg-zinc-900 rounded-full transition-colors">
    <MdOutlineComment className="text-zinc-200 h-5 w-5" />
  </button>



  {comments && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-black border border-zinc-800 p-6 rounded-xl text-white w-full max-w-[1000px] h-[80vh] max-h-[600px] relative shadow-xl flex flex-col">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        onClick={toggleComments}
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="flex-1 overflow-y-auto">
        {/* Comment list goes here - this will scroll if content exceeds height */}
        <p className="text-gray-300">No comments yet...</p>
      </div>
      {/* Optional comment input at bottom */}
      <div className="mt-4  flex gap-5 pt-4 border-t border-zinc-700">
        <input
          className="w-full bg-zinc-800 rounded-lg p-3 text-white focus:outline-none "
          placeholder="Add a comment..."
         
        />
        <button className="mt-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg">
          Post
        </button>
      </div>
    </div>
  </div>
)}


  {/* Share Button */}
  <button className="flex items-center justify-center p-2 hover:cursor-pointer hover:bg-zinc-900 rounded-full transition-colors">
    <FaShare className="text-zinc-200 h-5 w-5" />
  </button>
</div>

        </div>
      ))
    ) : (
      <p className="text-gray-500">No posts available.</p>
    )}
  </div>

  {/* Categories Sidebar */}
  <div className="w-[250px] border border-zinc-800 p-6">
    <h2 className="text-3xl font-extrabold text-center border-gray-700 pb-2">Looking for ?</h2>
    {/* Replace this with actual category list */}
    <ul className="space-y-2 text-gray-300">
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">General news</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Technology</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Business and Economy</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Science</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Health</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Law and Policy</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Entertainment and Lifestyle</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Sports</li>
      <li className="hover:text-white cursor-pointer hover:bg-zinc-800 hover:rounded-xl animation duration-400 p-3">Global</li>

    </ul>
  </div>
</div>



        </div>
      </div>
    </div>
  );
};

export default Happening;
