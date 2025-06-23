import { useState, useEffect } from "react";
import Navbar from "./HomeComponents/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "./HomeComponents/Sidebar";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../context/UserContext";
import { MdOutlineComment } from "react-icons/md";
import { FaShare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FiMoreVertical } from "react-icons/fi";

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
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [posts,setPosts] = useState<Post[]>([]);
  const [files, setFiles] = useState([]);

  const [showMore, setShowMore] = useState(false);

 const [selectedCategory, setSelectedCategory] = useState("");
const categories = [
  { value: "tech", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  // Add more categories as needed
];

 const navigate = useNavigate();

const handleChange = (e) => {
  if (e.target.files) {
    const selectedFiles = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  }
};

const removeImage = (index) => {
  setFiles(prevFiles => {
    const newFiles = [...prevFiles];
    URL.revokeObjectURL(newFiles[index].preview); // Clean up memory
    newFiles.splice(index, 1);
    return newFiles;
  });
};

useEffect(() => {
  return () => {
    files.forEach(file => URL.revokeObjectURL(file.preview));
  };
}, [files]);

  
 
 const {userId} = useUser();
 const {username} = useUser();


  

  const createPost = () => {
    setisVisible(true);
  };

  const StorePosts = async () => {
 
    const response = await axios.post("http://localhost:3000/api/v1/store-posts",{
        headline: headline,
        content:content,
        user_id: userId,
        selectedCategory:selectedCategory,
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


const handleMore = () =>{
  setShowMore(!showMore)
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

        <div className="flex-1 p-8 overflow-y-auto">
  <div className="max-w-6xl mx-auto">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8 pb-6 ">
      <h1 className="text-3xl font-bold tracking-tight">What's Happening</h1>
      <button
        onClick={createPost}
        className="bg-white hover:cursor-pointer text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
      >
        Create Post
      </button>
    </div>

    {/* Main Content Area */}
    <div className="flex gap-8">
      {/* Posts Column */}
      <div className="flex-1">
        {/* Create Post Modal */}
        <AnimatePresence>
         {isVisible && (
  <>
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setisVisible(false)}
    />

    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="bg-black w-full max-w-2xl rounded-xl border border-zinc-800 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => setisVisible(false)}
          className="absolute hover:cursor-pointer top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold">Share News With the World</h2>
        </div>

       <form className="p-6 space-y-6">
  <div>
    <input
      type="text"
      value={headline}
      onChange={(e) => setHeadline(e.target.value)}
      placeholder="What's the headline?"
      className="w-full bg-black text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-white border border-zinc-800"
    />
  </div>

  <div>
    <textarea
      rows={5}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="What's the story?"
      className="w-full bg-black text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-white border border-zinc-800 resize-none"
    />
    <div className="relative flex-1">
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="w-full bg-black text-white px-4 py-3 rounded-lg border border-zinc-800 focus:outline-none focus:ring-1 focus:ring-white appearance-none"
    >
      <option value="" disabled className="text-gray-500">
        Select category
      </option>
      {categories.map((category) => (
        <option 
          key={category.value} 
          value={category.value}
          className="bg-black text-white hover:bg-zinc-800"
        >
          {category.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  </div>


    {files.length > 0 && (
  <div className="relative mt-4 overflow-x-auto ">
    <div className="flex gap-4 px-2 w-max">
      {files.map((file, index) => (
        <div key={index} className="relative flex-shrink-0">
          <img
            src={file.preview}
            alt={`Uploaded preview ${index + 1}`}
            className="h-60 w-60 rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  </div>
)}

  </div>

  <div className="flex justify-between w-full items-center pt-4">
    <div className="flex gap-4">
      <label className="cursor-pointer p-3 rounded-full hover:bg-zinc-800 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 16l4-4a3 3 0 014 0l4 4M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <input 
          type="file" 
          onChange={handleChange} 
          accept="image/*" 
          className="hidden" 
          multiple 
        />
      </label>

      <label className="cursor-pointer p-3 rounded-full hover:bg-zinc-800 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
        </svg>
        <input type="file" accept="video/*" className="hidden" />
      </label>
    </div>

    <div className="flex gap-3">
      <button
        type="submit"
        onClick={StorePosts}
        className="bg-white text-black px-6 py-2 hover:cursor-pointer rounded-full font-medium hover:bg-gray-100 transition-colors"
      >
        Post
      </button>
    </div>
  </div>
</form>
      </div>
    </motion.div>
  </>
)}
        </AnimatePresence>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <article 
                key={post.post_id}
                className="bg-black p-6  rounded-xl border border-zinc-800  transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
  {/* Left: Avatar + Username + Timestamp */}
  <div className="flex items-center gap-4">
    {/* Avatar */}
    <img 
      src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg" 
      className="h-10 w-10 rounded-full" 
      alt="User avatar" 
    />
    
    {/* Username + Timestamp */}
    <div>
      <Link to={`/usersprofilepage/${post.user_id}`} state={{ username: post.username }}>
        <h3 className="font-semibold hover:underline cursor-pointer">
          {post.username}
        </h3>
      </Link>
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

  {/* Right: Links button */}
 <button
  onClick={handleMore}
  className="hover:cursor-pointer rounded-full hover:bg-zinc-800 p-3"
>
  <FiMoreVertical className="text-white size-5" />
</button>

{showMore && (
  <div className="absolute mt-2 right-0 bg-white border border-zinc-300 rounded-lg shadow-md w-40 z-50">
    <button
      // onClick={handleSave}
      className="w-full text-left px-4 py-2 hover:bg-zinc-100 text-sm text-black"
    >
      Save
    </button>
    <button
      // onClick={handleClaimTrue}
      className="w-full text-left px-4 py-2 hover:bg-zinc-100 text-sm text-black"
    >
      Claim True
    </button>
    <button
      // onClick={handleClaimFalse}
      className="w-full text-left px-4 py-2 hover:bg-zinc-100 text-sm text-black"
    >
      Claim False
    </button>
  </div>
)}



</div>


                <div className="space-y-4">
                  <h4 className="text-lg font-bold">{post.title}</h4>
                  <p className="text-gray-300 whitespace-pre-line">{post.content}</p>
                </div>

                <div className="flex items-center gap-4 mt-6 w-full pt-4 ">
                  <button
                    onClick={() => handleLike(post.post_id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <LikeComponent />
                    <span>Likes</span>
                  </button>

                  <button
                    onClick={toggleComments}
                    className="flex items-center hover:cursor-pointer gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <MdOutlineComment className="h-5 w-5" />
                    <span>Comments</span>
                  </button>

                   <button 
        onClick={() => setIsShareModalOpen(true)}
        className="flex hover:cursor-pointer items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <FaShare className="h-5 w-5" />
        <span>Share</span>
      </button>

       {isShareModalOpen && (
  <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
    <div className="bg-black border border-zinc-800 p-6 rounded-xl text-white w-full max-w-[1000px] h-[80vh] max-h-[600px] relative shadow-xl flex flex-col">
      <button
        className="absolute top-4 hover:cursor-pointer right-4 text-gray-400 hover:text-white text-xl"
        onClick={()=>setIsShareModalOpen(false)}
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Share with people</h2>
      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-300">share</p>
      </div>
      <div className="mt-4  flex gap-5 pt-4 border-t border-zinc-700">
        
        <button className="mt-2 hover:cursor-pointer bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg">
          send
        </button>
      </div>
    </div>
  </div>
)}

                </div>

                {/* Comments Modal */}
                {comments && (
  <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
    <div className="bg-black border border-zinc-800 p-6 rounded-xl text-white w-full max-w-[1000px] h-[80vh] max-h-[600px] relative shadow-xl flex flex-col">
      <button
        className="absolute top-4 hover:cursor-pointer right-4 text-gray-400 hover:text-white text-xl"
        onClick={toggleComments}
      >
        ✕
      </button>
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-300">No comments yet...</p>
      </div>
      <div className="mt-4  flex gap-5 pt-4 border-t border-zinc-700">
        <input
          className="w-full bg-zinc-800 rounded-lg p-3 text-white focus:outline-none "
          placeholder="Add a comment..."
         
        />
        <button className="mt-2 hover:cursor-pointer bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg">
          Post
        </button>
      </div>
    </div>
  </div>
)}
              </article>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No posts available yet</p>
              <button
                onClick={createPost}
                className="mt-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                Create First Post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Sidebar */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-black p-6 rounded-xl border border-zinc-800 sticky top-1">
          <h2 className="text-xl font-bold mb-6 pb-2 ">
            Looking for?
          </h2>
          <ul className="space-y-3">
            {[
              "General news",
              "Technology",
              "Business",
              "Science",
              "Health",
              "Law and Policy",
              "Entertainment",
              "Sports",
              "Global"
            ].map((category) => (
              <li 
                key={category}
                className="text-gray-300 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-full cursor-pointer transition-colors"
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default Happening;
