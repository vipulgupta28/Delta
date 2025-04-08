import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Channel: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const uploadContent = async () => {
    if (!file) {
      toast.error("Please select a video file first");
      return;
    }

    if(!title.trim()){
      toast.error("Please Enter Title");
      return;
    }

    if(!description.trim()){
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
  
      if(res.status == 200){
        setUploading(false);
        toast.success("Video uploaded Successfully");
      }
      
    } catch (error) {
  
      toast.error("Upload failed!");
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
    <div className="w-200 flex justify-center text-black bg-white rounded-xl  p-4 ">
      <motion.div 
        className=" p-8 rounded-xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-3xl font-bold  mb-6"
          variants={itemVariants}
        >
          {}
          Upload Your Video
        </motion.h2>

        <motion.div variants={itemVariants} className="space-y-5 text-left">
          <div>
            <label className="block  font-medium mb-2">Title</label>
            <input
              type="text"
              placeholder="Video Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

        
          <div>
            <label className="block  font-medium mb-2">Description</label>
            <textarea
              placeholder="Video Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 min-h-[100px]"
            />
          </div>

            <div>
              <label className="  font-medium mb-2">Video</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-dashed  rounded-md bg-gray-50 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
              />
            </div>

            <motion.button
            onClick={uploadContent}
            className="w-full bg-black text-white hover:cursor-pointer font-bold p-3 rounded-md hover:bg-gray-800 transition duration-300 mt-4"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload Content"
            )}
          </motion.button>
          
                  </motion.div>
      </motion.div>
    </div>
  );
};

export default Channel;
