import { useState } from 'react';

import api from '../../../api/api';

interface Source {
  name: string;
  url: string;
}

function AI() {
  const [query, setQuery] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setAnswer('');
    setSources([]);
    
    try {
      const res = await api.post('/query', { query });
      setAnswer(res.data.answer);
      setSources(res.data.sources);
    } catch (error) {
      setAnswer('⚠️ Oops, something went wrong. Try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] via-[#121212] to-[#1a1a1a] text-gray-100 flex flex-col">
      {/* Header */}
     

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto py-8 px-6 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 mb-6 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {answer && (
            <div className="space-y-4">
              <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg border border-gray-800">
                <div className="prose prose-invert max-w-none">
                  <p className="leading-relaxed text-gray-200">{answer}</p>
                </div>
              </div>

              {sources.length > 0 && (
                <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-lg border border-gray-800">
                  <h3 className="font-semibold text-lg mb-3 text-purple-400">Sources</h3>
                  <div className="space-y-2">
                    {sources.map((src, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-gray-500 mr-2 mt-1">•</span>
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:underline break-all"
                        >
                          {src.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/90 to-transparent pt-4 pb-6">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Give me today's news..."
              rows={3}
              className="w-full px-4 py-3 pr-16 rounded-2xl border border-zinc-800 bg-[#1a1a1a] focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-600/50 resize-none text-gray-100 placeholder-gray-500 transition-all"
              disabled={isLoading}
            />
            <button
              onClick={handleAsk}
              disabled={isLoading || !query.trim()}
              className={`absolute right-3 bottom-3 p-2 rounded-xl transition-all ${
                isLoading || !query.trim()
                  ? 'text-gray-500 bg-gray-800 cursor-not-allowed'
                  : 'text-white bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-purple-500 hover:to-blue-500 shadow-lg'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.3 0 0 5.3 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-8.7l-3-3a1 1 0 00-1.4 1.4L10.6 9H7a1 1 0 100 2h3.6l-1.3 1.3a1 1 0 101.4 1.4l3-3a1 1 0 000-1.4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        
        </div>
      </main>
    </div>
  );
}

export default AI;
