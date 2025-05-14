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
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);

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


  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setDirection("next");
      setFade(false); 
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setFade(true); 
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection("prev");
      setFade(false); 
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1);
        setFade(true); 
      }, 300);
    }
  };

  const getSlideAnimation = () => {
    if (!fade && direction === "next") return "animate-exit-to-top";
    if (!fade && direction === "prev") return "animate-exit-to-bottom";
    if (fade && direction === "next") return "animate-enter-from-bottom";
    if (fade && direction === "prev") return "animate-enter-from-top";
    return "";
  };

  return (
    <div className="relative flex flex-col items-center pr-45">
     
      
      <style>{`
        @keyframes exitToTop {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes exitToBottom {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes enterFromBottom {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes enterFromTop {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-exit-to-top {
          animation: exitToTop 0.5s ease-in-out forwards;
        }

        .animate-exit-to-bottom {
          animation: exitToBottom 0.5s ease-in-out forwards;
        }

        .animate-enter-from-bottom {
          animation: enterFromBottom 0.5s ease-in-out forwards;
        }

        .animate-enter-from-top {
          animation: enterFromTop 0.5s ease-in-out forwards;
        }
      `}</style>

      <div className="w-250 h-130 flex flex-col items-center bg-black text-white p-4 rounded-lg shadow-lg relative overflow-hidden">

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
                  hour12: true,
                })
              : "Loading..."}
          </p>
          
        </div>
       

        {videos.length > 0 ? (
          <video
            key={videos[currentIndex].file_url}
            src={videos[currentIndex].file_url}
            className={`w-full h-100 rounded-lg cursor-pointer transition-all border duration-500 ${getSlideAnimation()}`}
            controls
            autoPlay
          />
        ) : (
          <p className="text-white">Loading videos...</p>
        )}
      </div>

      <div className="absolute right-10 top-1/2 flex flex-col gap-7 transform -translate-y-1/2">
        <button
          className="bg-white text-black p-4 hover:bg-gray-300 transition duration-400 cursor-pointer rounded-full shadow-xl border"
          onClick={handlePrev}
        >
          ▲
        </button>
        <button
          className="bg-white text-black p-4 hover:bg-gray-300 transition duration-400 cursor-pointer rounded-full shadow-md border"
          onClick={handleNext}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default VideoSpace;