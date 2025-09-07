import { useState, useEffect } from "react";
import { Navbar } from "./layout";

import toast from "react-hot-toast";
import {Sidebar }from "./layout";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/api";
import { FaShare } from "react-icons/fa";
import { FiMoreVertical,FiBookmark, FiCheckCircle, FiXCircle, FiPlus } from "react-icons/fi";
import { formatTime } from "../utils/FormatTime";
import { LikeComponent } from "./features/interactions";
import {CommentSection} from "./features/interactions";



interface User {
  user_id: string;
  username: string;
  email: string;
  avatar?: string;
}



type Post = {
  post_id: string;
  title: string;
  headline: string; // If not used, you can remove
  content: string;
  created_at: string;
  user_id: string;
  username: string;
  media: string[]; // ⬅ Add this
  profiles: {
    profile_img: string;
  };
};


type MediaFile = {
  file: File;
  preview: string;
};

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

const Happening: React.FC = () => {
  const [isVisible, setisVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [headline, setHeadline] = useState("");
  const [content, setContent] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [posts,setPosts] = useState<Post[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedMediaList, setSelectedMediaList] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [
  { value: "tech", label: "Technology" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "science", label: "Science" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
  { value: "politics", label: "Politics" },
  { value: "world", label: "World" },
  { value: "education", label: "Education" },
  { value: "environment", label: "Environment" },
  { value: "travel", label: "Travel" },
  { value: "food", label: "Food" },
  { value: "fashion", label: "Fashion" },
  { value: "finance", label: "Finance" },
  { value: "automotive", label: "Automotive" },
  { value: "culture", label: "Culture" },
  { value: "crime", label: "Crime" },
  { value: "opinion", label: "Opinion" },
  { value: "lifestyle", label: "Lifestyle" }
];

const [mutuals, setMutuals] = useState<User[]>([]);
const [filteredMutuals, setFilteredMutuals] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");




const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const selectedFiles: MediaFile[] = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  }
};

useEffect(() => {
  if (!userId) return;

  const fetchMutuals = async () => {
    try {
      const { data } = await api.get(
        `/getMutuals/${userId}`
      );
      setMutuals(data.mutuals);
      setFilteredMutuals(data.mutuals);
    } catch (err) {
      console.error("Error fetching mutuals", err);
    } finally {
      setLoading(false);
    }
  };
  fetchMutuals();
}, [userId]);

useEffect(() => {
  setFilteredMutuals(
    mutuals.filter(u => u.username.toLowerCase().includes(search.toLowerCase()))
  );
}, [search, mutuals]);







const removeImage = (index:number) => {
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

  
 
 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get("/me"); // makes request with cookie
      const user = res.data.user;

      setUsername(user.username);
      setUserId(user.user_id);
      console.log("Username",username);
      console.log(userId)

    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  fetchUser();
}, []);


  

  const createPost = () => {
    setisVisible(true);
  };

  const StorePosts = async () => {
    const formData = new FormData();
  
    formData.append("headline", headline);
    formData.append("content", content);
    formData.append("user_id", userId);
    formData.append("selectedCategory", selectedCategory);
    formData.append("username", username);
  
    files.forEach((f) => {
      formData.append("media", f.file); // ✅ append actual file
    });
  
    try {
      const response = await api.post(
        "/store-posts",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
  
      if (response.status === 200) {
        console.log("Post with media uploaded");
        setFiles([]);
        setHeadline("");
        setContent("");
        setisVisible(false);
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };
  


  useEffect(()=>{
    fetchPosts();
  },[])




  const fetchPosts = async (category?: string) => {
    try {
      const response = await api.get("/get-posts", {
        params: category ? { category: category.toLowerCase() } : {}

      });
  
      setPosts(response.data);
      console.log("Fetched posts:", response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    }
  };
  
 

const handleLike = async(postID:string) =>{

  const response = await api.post("/likes",{
    user_id: userId,
    post_id: postID,

  })
   if(response.status === 200){
      toast.success("Liked")
    }
    else{
      toast.error("errror");
    }

}



const handleMore = () =>{
  setShowMore(!showMore)
}


const handleShare = async (postId: string) => {
  if (!selectedUser) return;

  try {
    console.log("Sharing post with data:", {
      sender_id: userId,
      receiver_ids: [selectedUser.user_id],
      post_id: postId,
    });

    await api.post("/sharePost", {
      sender_id: userId,
      receiver_ids: [selectedUser.user_id],
      post_id: postId,
    });

    setIsShareModalOpen(false);
  } catch (err) {
    console.error("Error sharing post:", err);
  }
};





    

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
      <div className="hidden md:block w-60 flex-shrink-0">
  <Sidebar />
</div>


        <div className="flex-1 p-8 overflow-y-auto">
  <div className="max-w-6xl mx-auto">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8 pb-6 ">
     
    <h1 className="text-3xl font-extrabold tracking-tight selection:bg-white selection:text-black flex items-center gap-4">
  {selectedCategory ? (
    <>
      Currently Surfing: <span className="capitalize text-blue-400">{selectedCategory}</span>
      <button
        onClick={() => {
          setSelectedCategory("");
          fetchPosts(); // ⬅️ Re-fetch all posts
        }}
        className="text-sm bg-white text-black px-3 py-2 hover:cursor-pointer rounded-full hover:bg-gray-200 transition"
      >
        Reset
      </button>
    </>
  ) : (
    "Share News and Updates"
  )}
</h1>

      
      
      
     <button
  onClick={createPost}
  className="bg-[#2c2c2c] flex items-center gap-3 text-white px-6 py-2 rounded-md hover:cursor-pointer shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)] border border-[#3d3d3d] hover:bg-[#3a3a3a] transition duration-200 font-medium"
>
  Create Post <FiPlus/>
  
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
      <div className="bg-[#121212] w-full max-w-2xl rounded-xl border border-zinc-800 overflow-hidden relative">
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

        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold">Share News With the World</h2>
        </div>

       <form className="p-6 space-y-6">
  <div>
    <input
      type="text"
      value={headline}
      onChange={(e) => setHeadline(e.target.value)}
      placeholder="What's the headline?"
      className="w-full text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-white border border-zinc-700"
    />
  </div>

  <div>
    <textarea
      rows={5}
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="What's the story?"
      className="w-full bg-[#121212] text-white  px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-white border border-zinc-700 resize-none"
    />
    <div className="relative flex-1 mt-4 ">
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="w-full bg-[#121212] text-white px-4 py-3  rounded-lg border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-white appearance-none"
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
  <div className="relative mt-4 overflow-x-auto">
    <div className="flex gap-4 px-2 w-max">
      {files.map((file, index) => (
        <div key={index} className="relative flex-shrink-0">
          {file.file.type.startsWith("video/") ? (
            <video
              src={file.preview}
              className="h-60 w-60 rounded-xl object-cover"
              controls
            />
          ) : (
            <img
              src={file.preview}
              alt={`Uploaded preview ${index + 1}`}
              className="h-60 w-60 rounded-xl object-cover"
            />
          )}

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
        <input 
        type="file" 
        onChange={handleChange}
        accept="video/*" 
        className="hidden" />
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
        
        <div className="">
          
          {posts.length > 0 ? (
            posts.map((post) => (
              <article
  key={post.post_id}
  className={`p-6 mb-6 rounded-xl bg-[#121212] transition-colors ${
    post.username === "vipul" ? "border-[#ADFFF5]" : "border-zinc-800"
  } border`}
>

                <div className="flex items-center justify-between mb-4">
  {/* Left: Avatar + Username + Timestamp */}
  <div className="flex items-center gap-4">
    {/* Avatar */}
    <img 
      src={post.profiles.profile_img}
      className="h-15 w-15 border border-zinc-800 rounded-full" 
      alt="User avatar" 
    />
    
    {/* Username + Timestamp */}
    <div className="flex gap-5 items-center">
      <Link to={`/usersprofilepage/${post.user_id}`} state={{ username: post.username }}>
        <h3 className=" text-xl font-semibold hover:underline cursor-pointer">
          {post.username}   
        </h3>
      </Link>
      <p className="text-sm font-medium text-[#60A5FA]">
          {formatTime(post.created_at)}
      </p>
    </div>
  </div>

  {/* Right: Links button */}
 <div className="relative inline-block">
    <button
      onClick={handleMore}
      className="hover:cursor-pointer rounded-full hover:bg-zinc-800 p-3"
    >
      <FiMoreVertical className="text-white size-5" />
    </button>

    <AnimatePresence>
      {showMore && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dropdownVariants}
          className="absolute right-3 mt-2 bg-black text-white border border-zinc-700 rounded-xl shadow-lg w-44 z-50 overflow-hidden"
        >
          <button
            // onClick={handleSave}
            className="w-full flex items-center gap-3 hover:cursor-pointer text-left px-4 py-3 hover:bg-zinc-800 text-sm transition-all"
          >
            <FiBookmark className="text-lg" />
            Save
          </button>
          <button
            // onClick={handleClaimTrue}
            className="w-full flex items-center gap-3 hover:cursor-pointer text-left px-4 py-3 hover:bg-zinc-800 text-sm transition-all"
          >
            <FiCheckCircle className="text-lg " />
            Claim True
          </button>
          <button
            // onClick={handleClaimFalse}
            className="w-full flex items-center gap-3 text-left hover:cursor-pointer px-4 py-3 hover:bg-zinc-800 text-sm transition-all"
          >
            <FiXCircle className="text-lg " />
            Claim False
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>



</div>


                <div className="space-y-4 ">
                  <h4 className="text-lg font-bold">{post.title}</h4>
                  <p className="text-gray-300 whitespace-pre-line">{post.content}</p>

                  {post.media?.length > 0 && (
  <div
    className={`mt-4 gap-4  ${
      post.media.length === 1
        ? "grid grid-cols-1"
        : post.media.length === 2
        ? "grid grid-cols-2"
        : "grid grid-cols-2 md:grid-cols-3"
    }`}
  >
    {post.media.slice(0, 3).map((url, index) => {
      const isLast = index === 2 && post.media.length > 3;

      return (
        <div
          key={index}
          onClick={() => {
            setSelectedMediaList(post.media);
            setSelectedIndex(index);
            setIsGalleryOpen(true);
          }}
          className="relative border border-zinc-800 w-full aspect-square rounded-xl overflow-hidden cursor-pointer"
        >
          {url.endsWith(".mp4") || url.includes("video") ? (
            <video
              src={url}
              controls
              className="w-full h-full object-cover rounded-xl pointer-events-none"
            />
          ) : (
            <img
              src={url}
              alt={`media-${index}`}
              className="w-full h-full object-cover rounded-xl"
            />
          )}

          {isLast && (
            <div
              className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold rounded-xl"
            >
              +{post.media.length - 3}
            </div>
          )}
        </div>
      );
    })}
  </div>
)}

{isGalleryOpen && (
  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
    <div className="relative max-w-3xl w-full">
      <button
        className="absolute top-2 right-2 text-white text-xl"
        onClick={() => setIsGalleryOpen(false)}
      >
        ✕
      </button>

      {selectedMediaList[selectedIndex].endsWith(".mp4") ? (
        <video
          src={selectedMediaList[selectedIndex]}
          controls
          autoPlay
          className="w-full rounded-xl"
        />
      ) : (
        <img
          src={selectedMediaList[selectedIndex]}
          alt="Full View"
          className="w-full rounded-xl"
        />
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={() =>
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
          }
          className="text-white px-4 py-2"
        >
          ← Prev
        </button>
        <button
          onClick={() =>
            setSelectedIndex((prev) =>
              prev < selectedMediaList.length - 1 ? prev + 1 : prev
            )
          }
          className="text-white px-4 py-2"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
)}

                  
                </div>

                <div className="flex items-center justify-between mt-6 w-full pt-4 ">
                  <button
                    onClick={() => handleLike(post.post_id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <LikeComponent postId={post.post_id} userId={userId} />

                    
                  </button>
                  <CommentSection
                 postID={post.post_id}
                  />


                   <button 
        onClick={() => setIsShareModalOpen(true)}
        className="flex hover:cursor-pointer items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <FaShare className="h-5 w-5" />
        <span>Share</span>
      </button>
      <button 
       
        className="flex hover:cursor-pointer items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <FiCheckCircle className="text-lg " />
        <span>Fact check it</span>
      </button>

      <AnimatePresence>
  {isShareModalOpen && (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsShareModalOpen(false)}
      />

      {/* Modal */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="bg-[#1a1a1a] border border-zinc-800 p-6 rounded-2xl text-white w-full max-w-2xl h-[80vh] max-h-[700px] relative shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Share with Connections</h2>
            <button
              className="p-1 rounded-full hover:bg-zinc-700 transition-colors"
              onClick={() => setIsShareModalOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search connections..."
              className="w-full bg-zinc-800 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-1 focus:ring-white"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredMutuals.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-lg">No connections found</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                {filteredMutuals.map((user) => (
                  <div 
                    key={user.user_id}
                    className="flex flex-col items-center group cursor-pointer"
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="relative mb-2">
                      <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xl font-bold text-white">
                            {user.username.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      {selectedUser?.user_id === user.user_id && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500 border-2 border-[#1a1a1a] flex items-center justify-center">
                          <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-center max-w-full truncate px-1 group-hover:text-blue-400 transition-colors">
                      {user.username}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 mt-auto">
            <button 
              onClick={() => handleShare(post.post_id)}
              className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedUser}
            >
              Share
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>

                </div>

                

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
      
      <div className="hidden lg:block w-72 flex-shrink-0 space-y-4">
  {/* Search input */}
  <div className="sticky top-1 z-10  pb-4">
    <input
      className="w-full p-3 rounded-lg border border-zinc-800 bg-[#121212] text-white  focus:outline-none focus:ring-2 focus:ring-zinc-600"
      placeholder="Search in posts"
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>
  
  {/* Categories section */}
  <div className="rounded-xl bg-[#121212] p-6 border border-zinc-800 sticky top-[4.5rem]">
    <h2 className="text-xl font-bold mb-6 pb-2 ">
      Looking for?
    </h2>
    
    <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scroll">
      {[
        "General news", "Technology", "Business", "Science", "Health", "Law and Policy", 
        "Entertainment", "Sports", "Global", "Design", "Politics", "World", "Education", 
        "Environment", "Travel", "Food", "Fashion", "Finance", "Automotive", "Culture", 
        "Crime", "Opinion", "Lifestyle"
      ].map((category) => (
        <li
          key={category}
          onClick={() => {
            setSelectedCategory(category);
            fetchPosts(category);
          }}
          className={`text-gray-300 hover:text-white hover:bg-zinc-900 px-3 py-2 rounded-full cursor-pointer transition-colors ${
            selectedCategory === category ? "bg-zinc-800 text-white" : ""
          }`}
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
