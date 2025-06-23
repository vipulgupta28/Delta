import { useEffect, useState } from "react";
import axios from "axios";
import CustomVideoPlayer from "./CustomVideoPlayer";

interface Video {
  file_url: string;
  file_name: string;
  title: string;
  description: string;
  uploaded_at: string;
}

const LongVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return <div className="p-4 text-center text-white">Loading videos...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500 text-center bg-gray-800 rounded">
        {error}
      </div>
    );
  if (videos.length === 0)
    return <div className="p-4 text-center text-white">No videos found</div>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6">
      {selectedVideo ? (
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setSelectedVideo(null)}
            className="mb-4 text-blue-400 hover:underline"
          >
            ← Back to video list
          </button>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Video player */}
            <div className="w-full lg:w-2/3">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <CustomVideoPlayer src={selectedVideo.file_url} />

              </div>
              <h1 className="text-2xl font-bold mt-4">{selectedVideo.title}</h1>
              <p className="text-sm text-gray-400 mt-1">
                Uploaded on {formatDate(selectedVideo.uploaded_at)}
              </p>
              <p className="mt-4 text-gray-300">
                {selectedVideo.description || "No description available."}
              </p>
            </div>

            {/* Related videos */}
            <div className="w-full lg:w-1/3">
              
              <div className="space-y-4">
                {videos
                  .filter((v) => v.file_url !== selectedVideo.file_url)
                  .slice(0, 6)
                  .map((video, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedVideo(video)}
                      className="flex gap-3 cursor-pointer hover:bg-zinc-800 p-2 rounded-lg"
                    >
                      <div className="w-40 h-24  rounded overflow-hidden">
                        <video
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                          playsInline
                        >
                          <source
                            src={video.file_url}
                            type={`video/${video.file_name.split(".").pop()}`}
                          />
                        </video>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium line-clamp-2 text-sm">
                          {video.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatDate(video.uploaded_at)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Video Grid
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Detailed News Videos</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className=" rounded-lg overflow-hidden hover:bg-zinc-800 transition cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="aspect-video bg-black">
                  <video
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                    playsInline
                  >
                    <source
                      src={video.file_url}
                      type={`video/${video.file_name.split(".").pop()}`}
                    />
                  </video>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white line-clamp-2">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Uploaded: {formatDate(video.uploaded_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LongVideos;
