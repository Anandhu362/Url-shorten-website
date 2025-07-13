// src/components/StatCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';
import { MousePointerClick, Globe, Monitor, Calendar } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<LucideProps>;
  color: 'blue' | 'green' | 'purple' | 'orange';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      shadow: '#3b82f6',
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      text: 'text-green-600',
      shadow: '#22c55e',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      shadow: '#a855f7',
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      text: 'text-orange-600',
      shadow: '#f97316',
    },
  };

  const selectedColor = colorConfig[color];

  // Map titles to specific icons
  const getIconForTitle = (title: string) => {
    switch (title) {
      case 'Total Clicks':
        return <MousePointerClick className="w-6 h-6 text-white" />;
      case 'Top Country':
        return <Globe className="w-6 h-6 text-white" />;
      case 'Top Device':
        return <Monitor className="w-6 h-6 text-white" />;
      case 'Created':
        return <Calendar className="w-6 h-6 text-white" />;
      default:
        return <Icon className="w-6 h-6 text-white" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
          whileHover={{ scale: 1.1, rotate: -5, transition: { duration: 0.2 } }}
          className={`w-12 h-12 bg-gradient-to-br ${selectedColor.gradient} rounded-xl flex items-center justify-center shadow-lg`}
        >
          {getIconForTitle(title)}
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            boxShadow: [
              `0 0 0px ${selectedColor.shadow}00`,
              `0 0 8px ${selectedColor.shadow}99`,
              `0 0 0px ${selectedColor.shadow}00`,
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`w-3 h-3 rounded-full bg-gradient-to-br ${selectedColor.gradient}`}
        />
      </div>
      
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </h3>
      
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <div className={`text-sm ${selectedColor.text} font-medium`}>
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
