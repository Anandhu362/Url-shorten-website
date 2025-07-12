// Home.tsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link2, Loader2, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// --- FIX: A list of known backend origins to check against ---
const KNOWN_BACKEND_ORIGINS = [
  'http://localhost:5000',
  API_BASE_URL
];

const Home = () => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingShortId, setExistingShortId] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- FIX: New helper function to extract shortId from any valid URL ---
  const extractShortIdFromUrl = (inputUrl: string): string | null => {
    try {
      const parsedUrl = new URL(inputUrl);
      // Check if the URL's origin is one of our known backend servers
      if (KNOWN_BACKEND_ORIGINS.includes(parsedUrl.origin)) {
        // Get the path (e.g., "/ktu") and remove the leading slash
        const path = parsedUrl.pathname;
        if (path && path.length > 1) {
          return path.substring(1);
        }
      }
    } catch (error) {
      // Not a valid URL, so it can't be a short link
      return null;
    }
    return null;
  };

  useEffect(() => {
    if (!url.trim()) {
      setExistingShortId(null);
      return;
    }

    const handler = setTimeout(async () => {
      // --- FIX: New device-agnostic checking logic ---
      const extractedId = extractShortIdFromUrl(url);
      
      if (extractedId) {
        // If we found a short ID, check if it exists in the database
        try {
          const response = await fetch(`${API_URL}/urls/check-short/${extractedId}`);
          const data = await response.json();
          setExistingShortId(data.exists ? data.url.shortId : null);
        } catch (error) {
          setExistingShortId(null);
        }
        return; // Stop here if it was a short link
      }

      // If it's not a short link, proceed with the original URL check
      if (customAlias.trim()) {
        setExistingShortId(null);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/urls/check`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ originalUrl: url }),
        });
        const data = await response.json();
        setExistingShortId(data.exists ? data.url.shortId : null);
      } catch (error) {
        setExistingShortId(null);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [url, customAlias]);

  const isValidUrl = (string: string) => {
    if (extractShortIdFromUrl(string)) return true;
    try { new URL(string); return true; } catch (_) { return false; }
  };

  const handleShorten = async () => {
    if (!isValidUrl(url)) {
      toast.error('Please enter a valid URL');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/urls/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: url, customAlias: customAlias || undefined }),
      });
      const urlData = await response.json();
      if (!response.ok) throw new Error(urlData.error || 'Something went wrong');
      
      toast.success(response.status === 201 ? 'URL shortened!' : 'Link found!');
      navigate(`/analytics/${urlData.shortId}`);
    } catch (error: any) {
      toast.error(error.message || 'Could not connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (existingShortId) {
      navigate(`/analytics/${existingShortId}`);
    } else {
      handleShorten();
    }
  };

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Shorten Your URLs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create short, memorable links with advanced analytics and custom aliases
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20 mb-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your long URL or an existing short link
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-6 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                />
                <Link2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom alias (optional)
              </label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-link"
                className="w-full px-6 py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                disabled={!!existingShortId}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleButtonClick}
              disabled={isLoading || !url.trim()}
              className={`w-full text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 ${
                existingShortId 
                  ? 'bg-gradient-to-r from-green-500 to-teal-500'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /><span>Checking...</span></>
              ) : existingShortId ? (
                <><BarChart3 className="w-5 h-5" /><span>View Analytics</span></>
              ) : (
                <><Link2 className="w-5 h-5" /><span>Shorten URL</span></>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;