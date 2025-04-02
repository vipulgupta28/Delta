import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Channel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const uploadContent = async () => {
    if (!file) {
      alert("Please select a video file first");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/store-content",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload success:", response.data);
      alert(`Video uploaded successfully! URL: ${response.data.publicUrl}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed!");
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
    <div className="flex justify-center  p-4 ">
      <motion.div 
        className="bg-white p-8 rounded-xl  w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-3xl font-bold text-gray-900 mb-6"
          variants={itemVariants}
        >
          Upload Your Video
        </motion.h2>

        <motion.div variants={itemVariants} className="space-y-5 text-left">
          {/* Title Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Title</label>
            <input
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              placeholder="Video Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[100px]"
            />
          </div>

          {/* File Inputs - Video & Thumbnail */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Video Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-dashed  rounded-md bg-gray-50 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
              />
            </div>

            {/* Thumbnail Input */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                className="w-full p-2  border border-dashed rounded-md bg-gray-50 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
              />
            </div>
          </div>

          {/* Upload Button */}
          <motion.button
            onClick={uploadContent}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-black text-white font-medium p-3 rounded-md hover:bg-gray-900 transition duration-300 mt-4"
          >
            Upload Content
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Channel;
