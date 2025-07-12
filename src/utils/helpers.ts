export const generateShortId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateMockAnalytics = () => {
  const countries = [
    { name: 'United States', code: 'US' },
    { name: 'Canada', code: 'CA' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Australia', code: 'AU' },
    { name: 'Japan', code: 'JP' },
    { name: 'India', code: 'IN' }
  ];

  const devices = ['Desktop', 'Mobile', 'Tablet'];
  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];

  // Generate daily clicks for the past 30 days
  const dailyClicks = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks: Math.floor(Math.random() * 50) + 10
    };
  });

  // Generate country data
  const countryData = countries.slice(0, 5).map(country => ({
    ...country,
    clicks: Math.floor(Math.random() * 100) + 20
  }));

  // Generate device data
  const deviceData = devices.map(device => ({
    name: device,
    clicks: Math.floor(Math.random() * 200) + 50
  }));

  // Generate browser data
  const browserData = browsers.map(browser => ({
    name: browser,
    clicks: Math.floor(Math.random() * 150) + 30
  }));

  return {
    dailyClicks,
    countries: countryData,
    devices: deviceData,
    browsers: browserData
  };
};