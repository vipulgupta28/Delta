import React, { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  file_url: string;
  file_name: string;
}

const VideoSpace: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Scroll to previous video
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <>
    <div className=" rounded-xl shadow-lg relative mt-10 ml-20 h-full overflow-hidden flex justify-center items-center">
      {/* Video Container */}
      <div
        className=" w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateY(-${currentIndex * 100}%)` }}
      >
        {videos.map((video, index) => (
          <div key={index} className="  w-full h-full flex ">
            <video controls className="w-full h-full ">
              <source src={video.file_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      {/* Scroll Buttons */}
      
    </div>
    <div className="absolute right-10 top-1/2 flex flex-col gap-7 transform -translate-y-1/2">
    <button
      className="bg-white text-black p-4 hover:bg-black hover:text-white animation duration-400 hover:cursor-pointer rounded-full shadow-xl border "
      onClick={handlePrev}
    >
      ▲
    </button>
    <button
      className="bg-white text-black p-4 hover:bg-black hover:text-white animation duration-400 hover:cursor-pointer rounded-full shadow-md border"
      onClick={handleNext}
    >
      ▼
    </button>
  </div>
  </>
  );
};

export default VideoSpace;
