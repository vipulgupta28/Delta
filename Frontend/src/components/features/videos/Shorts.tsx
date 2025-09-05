import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../../../api/api";
import { FileUpload } from "../../../ui/file-upload";

const Shorts: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
   
    const [userId, setUserId] = useState("");

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFileUrl(null);
    }
  }, [file]);

  const handleFileChange = (file: File) => {
  setFile(file);
};

 useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/me"); 
        const user = res.data.user;
       
        setUserId(user.user_id);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };

    fetchUser();
  }, []);

  const uploadContent = async () => {
    if (!file) return toast.error("Please select a video file");
    if (!title.trim()) return toast.error("Please enter a title");
    if (!description.trim()) return toast.error("Please enter a description");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("userId", userId);
    formData.append("description", description);

    try {
      setUploading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/store-short-content",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.status === 200) {
        toast.success("Video uploaded successfully");
        setFile(null);
        setTitle("");
        setDescription("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full  mx-auto bg-black text-white p-6">
      <motion.div 
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-2xl font-bold mb-8 tracking-tight"
          variants={itemVariants}
        >
          Upload Short Content
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Video Upload Section */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2"
          >
            <div className="border-2 border-dashed border-zinc-800 rounded-lg hover:border-gray-700 transition-colors">
              {fileUrl ? (
                <div className="relative pt-[56.25%] bg-black rounded-t-lg overflow-hidden">
                  <video 
                    src={fileUrl}
                    controls
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
                    <p className="text-sm font-medium truncate">{file?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {file?.size && (file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-10 text-center">
                 
                  <label className="px-4 py-2  text-black rounded-md text-sm font-medium cursor-pointer transition-colors">
                    Browse Files

                   <FileUpload onChange={(files) => {
  const videoFile = files.find(f => f.type.startsWith("video/"));
  if (videoFile) {
    handleFileChange(videoFile);
  } else {
    toast.error("Only video files are allowed");
  }
}} />


                  
                  </label>
                </div>
              )}
            </div>
            
            {file && (
              <button 
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="mt-3 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Remove video
              </button>
            )}
          </motion.div>

          {/* Form Section */}
          <motion.div 
            variants={itemVariants}
            className="w-full lg:w-1/2 space-y-6"
          >
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                placeholder="Video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">Description</label>
              <textarea
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#60A5FA] transition-colors"
              />
            </div>

            <div className="pt-2">
              <motion.button
                onClick={uploadContent}
                disabled={uploading || !file}
                className={`w-full font-medium py-3.5 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 transition-colors flex items-center justify-center
                  ${(!file || uploading) 
                    ? 'bg-zinc-900 text-gray-500 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-100'}`}
                whileHover={(!file || uploading) ? {} : { scale: 1.01 }}
                whileTap={(!file || uploading) ? {} : { scale: 0.98 }}
              >
                {uploading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full mr-2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Uploading...
                  </>
                ) : (
                  "Upload Video"
                )}
              </motion.button>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500">
                By submitting, you agree to our Terms of Service and Community Guidelines.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Shorts;