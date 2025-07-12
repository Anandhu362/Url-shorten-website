import React, { createContext, useContext, useState, useEffect } from 'react';

export interface URLData {
  id: string;
  originalUrl: string;
  shortUrl: string;
  customAlias?: string;
  clicks: number;
  createdAt: Date;
  analytics: {
    dailyClicks: { date: string; clicks: number }[];
    countries: { name: string; clicks: number; code: string }[];
    devices: { name: string; clicks: number }[];
    browsers: { name: string; clicks: number }[];
  };
}

interface URLContextType {
  urls: URLData[];
  addUrl: (url: URLData) => void;
  getUrl: (id: string) => URLData | undefined;
  updateClicks: (id: string) => void;
}

const URLContext = createContext<URLContextType | undefined>(undefined);

export const useURL = () => {
  const context = useContext(URLContext);
  if (!context) {
    throw new Error('useURL must be used within a URLProvider');
  }
  return context;
};

export const URLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [urls, setUrls] = useState<URLData[]>([]);

  useEffect(() => {
    const savedUrls = localStorage.getItem('shortUrls');
    if (savedUrls) {
      const parsed = JSON.parse(savedUrls);
      setUrls(parsed.map((url: any) => ({
        ...url,
        createdAt: new Date(url.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shortUrls', JSON.stringify(urls));
  }, [urls]);

  const addUrl = (url: URLData) => {
    setUrls(prev => [url, ...prev]);
  };

  const getUrl = (id: string) => {
    return urls.find(url => url.id === id);
  };

  const updateClicks = (id: string) => {
    setUrls(prev => prev.map(url => 
      url.id === id 
        ? { ...url, clicks: url.clicks + 1 }
        : url
    ));
  };

  return (
    <URLContext.Provider value={{ urls, addUrl, getUrl, updateClicks }}>
      {children}
    </URLContext.Provider>
  );
};