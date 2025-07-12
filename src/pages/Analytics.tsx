// Analytics.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Copy, TrendingUp, Users, Globe, Smartphone, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ClickChart from '../components/ClickChart';
import WorldMap from '../components/WorldMap';
import StatCard from '../components/StatCard';
import DeviceChart from '../components/DeviceChart';

// Use environment variable for the API URL for better deployment flexibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api`;

// Interface for our analytics data structure
interface AnalyticsData {
  totalClicks: number;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clickChartData: { date: string; clicks: number }[];
  deviceChartData: { name: string; clicks: number }[];
  worldMapData: { name: string; clicks: number; code: string }[];
  browserChartData: { name: string; clicks: number }[];
}

const Analytics = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalyticsData = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/urls/analytics/${shortId}`);
      if (!response.ok) {
        if (response.status === 404) {
          toast.error('This shortened link does not exist.');
          navigate('/notfound');
        }
        throw new Error('URL not found');
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      if (isInitialLoad) {
        toast.error('Could not load analytics for this link.');
        navigate('/notfound');
      }
    } finally {
      if (isInitialLoad) setIsLoading(false);
    }
  }, [shortId, navigate]);

  useEffect(() => {
    if (!shortId) {
      navigate('/notfound');
      return;
    }
    fetchAnalyticsData(true);
    const intervalId = setInterval(() => fetchAnalyticsData(false), 3500);
    return () => clearInterval(intervalId);
  }, [shortId, fetchAnalyticsData, navigate]);

  // FINAL FIX: A robust copy function with a fallback and proper event handling.
  const copyToClipboard = async (text: string) => {
    // Modern browsers: Use the Clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
        return;
      } catch (err) {
        console.error('Failed to copy with Clipboard API:', err);
        // Fallback will be attempted below
      }
    }

    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // Prevent scrolling to bottom
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Fallback copy method failed:', err);
      toast.error('Could not copy to clipboard.');
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        <Loader2 className="w-8 h-8 mr-3 animate-spin" />
        Loading Analytics...
      </div>
    );
  }

  if (!analyticsData) return null;

  const { 
    totalClicks, 
    originalUrl, 
    shortUrl, 
    createdAt,
    clickChartData, 
    deviceChartData, 
    worldMapData,
  } = analyticsData;

  const topCountry = worldMapData.length > 0 ? [...worldMapData].sort((a, b) => b.clicks - a.clicks)[0] : null;
  const topDevice = deviceChartData.length > 0 ? [...deviceChartData].sort((a, b) => b.clicks - a.clicks)[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </button>

          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              Analytics Dashboard
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Short URL
                </label>
                <div className="flex items-center justify-between space-x-2 bg-gray-100 dark:bg-gray-900/50 p-2.5 rounded-lg">
                  <span className="text-base font-mono text-blue-600 dark:text-blue-400 truncate select-all">
                    {shortUrl}
                  </span>
                  <button
                    type="button"
                    aria-label="Copy short URL to clipboard"
                    tabIndex={0}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent any parent click events
                      copyToClipboard(shortUrl);
                    }}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Original URL
                </label>
                <div className="flex items-center justify-between space-x-2 bg-gray-100 dark:bg-gray-900/50 p-2.5 rounded-lg">
                  <span className="text-base text-gray-700 dark:text-gray-300 truncate">
                    {originalUrl}
                  </span>
                  <a
                    href={originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    aria-label="Open original URL in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          <StatCard title="Total Clicks" value={totalClicks.toString()} icon={TrendingUp} color="blue" />
          <StatCard title="Top Country" value={topCountry?.name || 'N/A'} icon={Globe} color="green" trend={`${topCountry?.clicks || 0} clicks`} />
          <StatCard title="Top Device" value={topDevice?.name || 'N/A'} icon={Smartphone} color="purple" trend={`${topDevice?.clicks || 0} clicks`} />
          <StatCard title="Created" value={new Date(createdAt).toLocaleDateString()} icon={Users} color="orange" trend="Active link" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-3"><ClickChart data={clickChartData} /></div>
          <div className="lg:col-span-2"><DeviceChart data={deviceChartData} /></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <WorldMap data={worldMapData} />
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;