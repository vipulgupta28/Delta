import React, { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  file_url: string;
  file_name: string;
  title: string;
  description: string;
  uploaded_at: string;
}

const VideoSpace: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/get-videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Scroll to next video
  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setFade(false); // Trigger fade-out
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setFade(true); // Trigger fade-in
      }, 200);
    }
  };

  // Scroll to previous video
  const handlePrev = () => {
    if (currentIndex > 0) {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setFade(true);
      }, 200);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Video Container */}
      <div className="w-270 h-150 flex flex-col items-center bg-black text-white p-4 rounded-lg shadow-lg relative">
        
        {/* Title & Timestamp Container */}
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-bold">{videos[currentIndex]?.title || "Loading..."}</h2>
          <p className="text-sm text-gray-400">
            Uploaded:<br />
            {videos[currentIndex]?.uploaded_at
              ? new Date(videos[currentIndex].uploaded_at).toLocaleString("en-US", { 
                  year: "numeric", 
                  month: "long", 
                  day: "numeric", 
                  hour: "2-digit", 
                  minute: "2-digit", 
                  second: "2-digit", 
                  hour12: true 
                }) 
              : "Loading..."}
          </p>
        </div>

        {/* Video Player with Fade Animation */}
        {videos.length > 0 ? (
          <video
            key={videos[currentIndex].file_url}
            src={videos[currentIndex].file_url}
            className={`w-300 h-[90%] rounded-lg hover:cursor-pointer transition-opacity duration-500 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            controls
            autoPlay
          />
        ) : (
          <p>Loading videos...</p>
        )}
      </div>

      {/* Scroll Buttons */}
      <div className="absolute right-10 top-1/2 flex flex-col gap-7 transform -translate-y-1/2">
        <button
          className="bg-white text-black p-4 hover:bg-black hover:text-white transition duration-400 cursor-pointer rounded-full shadow-xl border"
          onClick={handlePrev}
        >
          ▲
        </button>
        <button
          className="bg-white text-black p-4 hover:bg-black hover:text-white transition duration-400 cursor-pointer rounded-full shadow-md border"
          onClick={handleNext}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default VideoSpace;
