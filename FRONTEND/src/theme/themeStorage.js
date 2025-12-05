const THEME_STORAGE_KEY = 'storydeck_theme_mode';

export const themeStorage = {
  // Get theme from localStorage
  getTheme: () => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      // Default to light mode if no valid theme is saved
      return 'light';
    } catch (error) {
      console.error('Failed to read theme from localStorage:', error);
      return 'light';
    }
  },

  // Save theme to localStorage
  saveTheme: (theme) => {
    try {
      if (theme === 'dark' || theme === 'light') {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
        return true;
      }
      console.warn('Invalid theme value. Use "light" or "dark"');
      return false;
    } catch (error) {
      console.error('Failed to save theme to localStorage:', error);
      return false;
    }
  },

  // Remove theme from localStorage
  removeTheme: () => {
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to remove theme from localStorage:', error);
      return false;
    }
  },

  // Check if dark mode is enabled
  isDarkMode: () => {
    return themeStorage.getTheme() === 'dark';
  },

  // Toggle theme
  toggleTheme: () => {
    const currentTheme = themeStorage.getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    themeStorage.saveTheme(newTheme);
    return newTheme;
  },
};
