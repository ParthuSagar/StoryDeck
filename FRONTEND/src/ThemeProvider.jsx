import { createContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';
import { themeStorage } from './theme/themeStorage';

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return themeStorage.isDarkMode();
  });

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      const themeType = newMode ? 'dark' : 'light';
      themeStorage.saveTheme(themeType);
      return newMode;
    });
  };

  // Sync with localStorage changes in other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'storydeck_theme_mode') {
        const newTheme = event.newValue;
        setIsDarkMode(newTheme === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
