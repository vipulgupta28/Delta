import { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  file_url: string;
  file_name: string;
  title: string;
  description: string;
  uploaded_at: string;
}

const UsersUploads = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/get-videos");
        setVideos(response.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div className="p-4 text-center">Loading videos...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;
  if (videos.length === 0) return <div className="p-4 text-center">No videos found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Uploads</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {videos.map((video, index) => (
          <div key={index} className="rounded-lg overflow-hidden hover:bg-zinc-900 p-3 hover:shadow-lg transition-shadow duration-300 ">
            {/* Video Player */}
            <div className="relative  aspect-video ">
              <video
           
                className="w-full hover:cursor-pointer h-full object-cover rounded-t-lg"
                preload="metadata"
              >
                <source src={video.file_url} type={`video/${video.file_name.split('.').pop()}`} />
                Your browser does not support the video tag.
              </video>
            </div>
            
            {/* Video info */}
            <div className="p-3">
              <h3 className="font-medium text-md line-clamp-2 text-gray-900 dark:text-white">
                {video.title || 'Untitled Video'}
              </h3>
             
              <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                Uploaded: {formatDate(video.uploaded_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersUploads;