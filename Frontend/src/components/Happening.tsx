import { useState, useEffect } from "react";
import Navbar from "./HomeComponents/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./HomeComponents/Sidebar";
import { motion, AnimatePresence } from "framer-motion";

type Post = {
  id: string;
  headline: string;
  content: string;
  created_at: string;
  user_id: string;
};

const Happening: React.FC = () => {
  const [isVisible, setisVisible] = useState(false);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
 
  const fetchPosts = async (pageNum: number) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/get-posts?page=${pageNum}&limit=5`);
      const newPosts = res.data;

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
        setPage(prev => prev + 1);
      }
    } catch (err) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 &&
        !loading &&
        hasMore
      ) {
        fetchPosts(page);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [page, loading, hasMore]);

  const createPost = () => {
    setisVisible(true);
  };

  const StorePosts = async () => {
    const user_id= localStorage.getItem('user_id')
    const response = await axios.post("http://localhost:3000/api/v1/store-posts",{
        headline: headline,
        content:content,
        user_id: user_id
    });

    if(response.status === 200){
        console.log("Post uploaded")
    }
  }



  
    

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
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <div className="flex justify-center px-4 mt-10">
  <div className="w-full max-w-3xl space-y-6">
    {posts.map((post) => (
      <div
        key={post.id}
        className=" p-6 border-zinc-700 border-b "
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-white font-bold">{post.user_id}</p>
          <span className="text-sm text-gray-400">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-xl font-semibold text-white mb-2">{post.headline}</h2>

        {/* Content */}
        <p className="text-gray-300 mb-4">{post.content}</p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-full text-black hover:bg-gray-200 transition">
            Claim True
          </button>
          <button className="bg-white px-4 py-2 rounded-full text-black hover:bg-gray-200 transition">
            Claim False
          </button>
          <button className="bg-white px-4 py-2 rounded-full text-black hover:bg-gray-200 transition">
            Debate
          </button>
        </div>
      </div>
    ))}
  </div>
</div>


        </div>
      </div>
    </div>
  );
};

export default Happening;
