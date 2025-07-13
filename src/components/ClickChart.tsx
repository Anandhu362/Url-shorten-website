// src/components/ClickChart.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ClickChartProps {
  data: { date: string; clicks: number }[];
}

const ClickChart: React.FC<ClickChartProps> = ({ data }) => {
  // This function creates the neon gradient for the line
  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    const gradient = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
    gradient.addColorStop(0, '#60a5fa'); // neon blue
    gradient.addColorStop(1, '#a78bfa'); // neon purple
    return gradient;
  };

  const chartData = React.useMemo(() => ({
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Clicks',
        data: data.map(d => d.clicks),
        // Use a function to apply the gradient
        borderColor: (context: any) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return '#60a5fa'; // Fallback color
          }
          return getGradient(ctx, chartArea);
        },
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        borderWidth: 4,
        fill: true,
        tension: 0.5, // This creates the smooth, monotone curve
        pointBackgroundColor: '#60a5fa',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#a78bfa',
      }
    ]
  }), [data]);

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    // This block enables the smooth "draw" and update animations
    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#60a5fa',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9CA3AF' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
        ticks: { color: '#9CA3AF' }
      }
    },
    elements: {
      line: {
        borderWidth: 4,
      },
      point: {
        hoverBackgroundColor: '#a78bfa',
        hoverBorderColor: 'white'
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Click Trends
      </h3>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </motion.div>
  );
};

export default ClickChart;
