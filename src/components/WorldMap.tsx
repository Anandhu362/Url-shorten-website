// src/components/WorldMap.tsx
import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { motion } from 'framer-motion';

// Using a reliable CDN URL for the map data
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

interface MapData {
  code: string; // This should be the 3-letter code from your backend (e.g., "IND", "USA")
  name: string;
  clicks: number;
}

interface WorldMapProps {
  data: MapData[];
}

const WorldMap = ({ data }: WorldMapProps) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const dataMap = new Map(
    data.map(d => [d.code, { clicks: d.clicks, name: d.name }])
  );

  const maxClicks = Math.max(...data.map(d => d.clicks), 1);
  const colorScale = scaleLinear<string>()
    .domain([0, maxClicks])
    .range(['#c7d2fe', '#4f46e5']);

  const handleMouseMove = (evt: React.MouseEvent<HTMLDivElement>) => {
    setTooltipPosition({ x: evt.clientX + 10, y: evt.clientY - 10 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 dark:border-gray-700/20 relative"
      onMouseMove={handleMouseMove}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Global Clicks
      </h3>

      {tooltipContent && (
        <div
          className="absolute p-2 bg-gray-900 text-white text-xs rounded-lg pointer-events-none z-20 shadow-lg"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          {tooltipContent}
        </div>
      )}

      {/* **** FIX: The height is now responsive for mobile and desktop **** */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[400px] w-full overflow-hidden rounded-xl">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 120 }}
          width={800}
          height={400}
          data-tip=""
        >
          <ZoomableGroup center={[0, 20]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const countryCode = geo.properties.iso_a3;
                  const countryName = geo.properties.name;
                  const countryData = countryCode ? dataMap.get(countryCode) : null;
                  const clicks = countryData?.clicks || 0;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (clicks > 0) {
                          setTooltipContent(`${countryName}: ${clicks} click${clicks !== 1 ? 's' : ''}`);
                        }
                      }}
                      onMouseLeave={() => setTooltipContent('')}
                      style={{
                        default: {
                          fill: clicks > 0 ? colorScale(clicks) : '#E9ECEF',
                          stroke: '#FFF',
                          strokeWidth: 0.5,
                          outline: 'none',
                          transition: 'fill 0.3s ease-in-out',
                        },
                        hover: {
                          fill: clicks > 0 ? '#6366f1' : '#D1D5DB',
                          outline: 'none',
                        },
                        pressed: {
                          fill: '#4338ca',
                          outline: 'none',
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing data from {data.length} countries
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">Low</span>
          <div className="w-24 h-2 rounded-full" style={{ background: 'linear-gradient(to right, #c7d2fe, #4f46e5)' }}></div>
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">High</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMap;
