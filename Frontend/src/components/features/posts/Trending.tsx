import React, { useEffect, useState } from "react";
import axios from "axios";

interface Article {
  title: string;
  description: string;
  url: string;
}

const Trending: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `
https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=5689da049eb240f4aa91c8aa6e6adfaf`
        );
        setArticles(res.data.articles);
      } catch (err) {
        setError("Failed to fetch news. Try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const trimToWords = (text: string, wordLimit: number) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  if (loading) return <p className="text-gray-400">Loading news...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">India News</h2>
      {articles.map((article, i) => (
        <div
          key={i}
          className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
        >
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-gray-900 hover:text-blue-600"
          >
            {article.title}
          </a>
          <p className="text-gray-600 mt-2">
            {article.description
              ? trimToWords(article.description, 50)
              : "No description available."}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Trending;
