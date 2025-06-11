import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Channel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file URL creation and cleanup
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setFileUrl(null);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadContent = async () => {
    if (!file) {
      toast.error("Please select a video file first");
      return;
    }

    if (!title.trim()) {
      toast.error("Please Enter Title");
      return;
    }

    if (!description.trim()) {
      toast.error("Please Enter Description");
      return;
    }
  
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description);
  
    try {
      setUploading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/store-content",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (res.status === 200) {
        setUploading(false);
        toast.success("Video uploaded Successfully");
        // Reset form after successful upload
        setFile(null);
        setTitle("");
        setDescription("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setUploading(false);
      toast.error("Upload failed!");
      console.error("Upload error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-black text-white p-6 rounded-lg">
      <motion.div 
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-2xl font-semibold mb-8"
          variants={itemVariants}
        >
          Upload Video
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-8 ">
          {/* Left Column - Video Preview/Upload */}
          <motion.div 
            variants={itemVariants}
            className="w-full md:w-1/2 pt-10"
          >
            <div className="border-2 border-dashed border-zinc-800 rounded-lg  hover:bg-zinc-900 transition">
              {fileUrl ? (
                <div className="relative pt-[56.25%]">
                  <video 
                    src={fileUrl}
                    controls
                    className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-sm font-medium truncate">{file?.name}</p>
                    <p className="text-xs text-gray-400">
                      {(file?.size && (file.size / (1024 * 1024)).toFixed(2))} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="text-lg font-medium mb-2">Select files to upload</p>
                  <p className="text-sm text-gray-400 mb-4">Drag and drop video files or click to browse</p>
                  <label className="px-4 py-2 bg-white text-black rounded-md text-sm font-medium cursor-pointer hover:bg-gray-200 transition">
                    Select Files
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden" 
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-4">MP4, MOV, AVI up to 1GB</p>
                </div>
              )}
            </div>
            
            {file && (
              <button 
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="mt-2 text-sm text-gray-400 hover:text-white transition"
              >
                Change video
              </button>
            )}
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            variants={itemVariants}
            className="w-full md:w-1/2 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Title</label>
              <input
                type="text"
                placeholder="Add a title that describes your video"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5  border border-zinc-700 rounded-md text-white  focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Description</label>
              <textarea
                placeholder="Tell viewers about your video"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5  border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 min-h-[120px] transition"
              />
            </div>

            <div className="pt-2">
              <motion.button
                onClick={uploadContent}
                disabled={uploading || !file}
                className={`w-full font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition duration-200 flex items-center justify-center
                  ${(!file || uploading) 
                    ? 'bg-zinc-900 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-black hover:bg-gray-200 hover:cursor-pointer'}`}
                whileHover={(!file || uploading) ? {} : { scale: 1.01 }}
                whileTap={(!file || uploading) ? {} : { scale: 0.99 }}
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
                By submitting your videos to Delta, you acknowledge that you agree to Delta's Terms of Service and Community Guidelines.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Channel;