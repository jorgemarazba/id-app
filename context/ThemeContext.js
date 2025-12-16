import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar preferencia de tema
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando preferencia de tema:', error);
      setLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode ? 'dark' : 'light';
      await AsyncStorage.setItem('theme', newTheme);
      setIsDarkMode(!isDarkMode);
    } catch (error) {
      console.error('Error guardando preferencia de tema:', error);
    }
  };

  // Paleta de colores
  const lightTheme = {
    isDark: false,
    background: '#f5f5f5',
    cardBackground: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#e0e0e0',
    primary: '#007AFF',
    primaryLight: '#E3F2FD',
    danger: '#FF3B30',
    dangerLight: '#FFE5E5',
    success: '#34C759',
    successLight: '#E8F5E9',
    warning: '#8B5CF6',
    warningLight: '#F0E5FF',
    inputBackground: '#ffffff',
    inputBorder: '#e0e0e0',
    headerBackground: '#ffffff',
    headerBorder: '#e0e0e0',
    sectionHeader: '#e8e8e8',
    placeholderText: '#999999',
  };

  const darkTheme = {
    isDark: true,
    background: '#1a1a1a',
    cardBackground: '#2d2d2d',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    textTertiary: '#808080',
    border: '#404040',
    primary: '#0A84FF',
    primaryLight: '#1e3a5f',
    danger: '#FF453A',
    dangerLight: '#5a1515',
    success: '#30B0C0',
    successLight: '#0f3a3a',
    warning: '#9D4EDD',
    warningLight: '#2d1b4e',
    inputBackground: '#3a3a3a',
    inputBorder: '#505050',
    headerBackground: '#2d2d2d',
    headerBorder: '#404040',
    sectionHeader: '#404040',
    placeholderText: '#808080',
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDarkMode,
        toggleTheme,
        loading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
