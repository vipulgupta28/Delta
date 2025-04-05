import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./HomeComponents/Navbar";
import Sidebar from "./HomeComponents/Sidebar";

interface Article {
  title: string;
  url: string;
  image: string;
  description: string;
}

const Trending: React.FC = () => {
  const [news, setNews] = useState<Article[]>([]);

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const res = await axios.get(
          `https://gnews.io/api/v4/top-headlines?lang=en&token=9d627b092fc4855009af49b341d7dd61`
        );
        setNews(res.data.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchTrendingNews();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 mt-10 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 mt-10 px-10 ml-10 overflow-y-auto">
          {/* Trending News Section */}
          <div className=" space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight border-b border-gray-700 pb-2">
              Trending News
            </h1>
            {news.length > 0 ? (
              <div className="grid grid-cols-3 gap-6">
                {news.map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-white text-black rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:bg-black hover:text-white transition-all duration-300"
                  >
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold leading-tight line-clamp-2 hover:text-gray-300 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm text-gray-400 mt-2 line-clamp-3">
                        {article.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Loading news...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;