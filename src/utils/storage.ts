const PROJECT_KEY = 'verigen';

export const StorageUtil = {
  set: (key: string, value: string) => {
    const existingData = localStorage.getItem(PROJECT_KEY);
    const parsedData = existingData ? JSON.parse(existingData) : {};
    parsedData[key] = value;
    localStorage.setItem(PROJECT_KEY, JSON.stringify(parsedData));
  },

  get: (key: string) => {
    const item = localStorage.getItem(PROJECT_KEY);
    if (!item) return null;
    try {
      const parsed = JSON.parse(item);
      return parsed[key] ?? null;
    } catch (error) {
      console.error('Error parsing storage data:', error);
      return null;
    }
  },

  remove: (key: string) => {
    const item = localStorage.getItem(PROJECT_KEY);
    if (!item) return;
    try {
      const parsed = JSON.parse(item);
      delete parsed[key];
      if (Object.keys(parsed).length === 0) {
        localStorage.removeItem(PROJECT_KEY);
      } else {
        localStorage.setItem(PROJECT_KEY, JSON.stringify(parsed));
      }
    } catch (error) {
      console.error('Error updating storage data:', error);
    }
  },
};
