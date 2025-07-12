import React from 'react';
import { motion } from 'framer-motion';
import { Copy, Share2, BarChart3, QrCode, ExternalLink } from 'lucide-react';
import { URLData } from '../contexts/URLContext';

interface LinkCardProps {
  urlData: URLData;
  index: number;
  onCopy: (text: string) => void;
  onShare: (url: string) => void;
  onShowQR: (url: string) => void;
  onViewAnalytics: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({
  urlData,
  index,
  onCopy,
  onShare,
  onShowQR,
  onViewAnalytics
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {urlData.shortUrl}
            </span>
            {urlData.customAlias && (
              <span className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded-full">
                Custom
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm truncate">
            {urlData.originalUrl}
          </p>
        </div>
        <div className="flex items-center space-x-1 ml-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onCopy(urlData.shortUrl)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Copy link"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(urlData.shortUrl)}
            className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Share link"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShowQR(urlData.shortUrl)}
            className="p-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="Generate QR code"
          >
            <QrCode className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onViewAnalytics}
            className="p-2 text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            title="View analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{urlData.clicks} clicks</span>
        <span>Created {urlData.createdAt.toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
};

export default LinkCard;