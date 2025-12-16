import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptPassword, decryptPassword } from '../services/encryptionService';

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Mapeo de dominios a grupos
const DOMAIN_GROUPS = {
  'google': 'Google',
  'gmail': 'Google',
  'mail': 'Google',
  'drive': 'Google',
  'classroom': 'Google',
  'sheets': 'Google',
  'docs': 'Google',
  
  'meta': 'Meta',
  'facebook': 'Meta',
  'fb': 'Meta',
  'instagram': 'Meta',
  'ig': 'Meta',
  'whatsapp': 'Meta',
  
  'twitter': 'Twitter/X',
  'x': 'Twitter/X',
  
  'youtube': 'YouTube',
  
  'microsoft': 'Microsoft',
  'outlook': 'Microsoft',
  'teams': 'Microsoft',
  'office': 'Microsoft',
  'windows': 'Microsoft',
  'xbox': 'Microsoft',
  
  'amazon': 'Amazon',
  'aws': 'Amazon',
  
  'apple': 'Apple',
  'icloud': 'Apple',
  'itunes': 'Apple',
  
  'paypal': 'PayPal',
  'ebay': 'eBay',
  'github': 'GitHub',
  'gitlab': 'GitLab',
  'linkedin': 'LinkedIn',
  'discord': 'Discord',
  'twitch': 'Twitch',
  'reddit': 'Reddit',
  'pinterest': 'Pinterest',
  'tiktok': 'TikTok',
  'snapchat': 'Snapchat',
  'telegram': 'Telegram',
  
  'spotify': 'Entretenimiento',
  'netflix': 'Entretenimiento',
  'hulu': 'Entretenimiento',
  'disney': 'Entretenimiento',
  'prime': 'Entretenimiento',
  'hbo': 'Entretenimiento',
  
  'uber': 'Viajes',
  'airbnb': 'Viajes',
  'booking': 'Viajes',
  'expedia': 'Viajes',
  
  'slack': 'Productividad',
  'zoom': 'Productividad',
  'skype': 'Productividad',
  'notion': 'Productividad',
  
  'coinbase': 'Cripto',
  'binance': 'Cripto',
  'kraken': 'Cripto',
  'crypto': 'Cripto',
  
  'bank': 'Finanzas',
  'wise': 'Finanzas',
  'revolut': 'Finanzas',
  'stripe': 'Finanzas',
};

// Función para obtener el grupo de una contraseña
const getGroupForPassword = (pageName) => {
  const domain = pageName.toLowerCase().replace(/\s+/g, '');
  
  // Buscar en el mapeo exacto
  if (DOMAIN_GROUPS[domain]) {
    return DOMAIN_GROUPS[domain];
  }
  
  // Buscar si alguna clave está contenida en el nombre
  for (const [key, group] of Object.entries(DOMAIN_GROUPS)) {
    if (domain.includes(key)) {
      return group;
    }
  }
  
  // Si no encuentra grupo, usar "Otros"
  return 'Otros';
};

// Función para agrupar contraseñas
const groupPasswords = (passwordsList) => {
  const grouped = {};
  
  passwordsList.forEach((password) => {
    const group = getGroupForPassword(password.pageName);
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(password);
  });
  
  // Ordenar grupos alfabéticamente
  const sortedGroups = {};
  Object.keys(grouped).sort().forEach((key) => {
    sortedGroups[key] = grouped[key];
  });
  
  return sortedGroups;
};

export const PasswordContext = createContext();

// Categorías predeterminadas
const DEFAULT_CATEGORIES = [
  { id: '1', name: 'Personal', icon: '👤', color: '#FF9500' },
  { id: '2', name: 'Trabajo', icon: '💼', color: '#007AFF' },
  { id: '3', name: 'Redes Sociales', icon: '📱', color: '#FF2D55' },
  { id: '4', name: 'Finanzas', icon: '💰', color: '#34C759' },
  { id: '5', name: 'Entretenimiento', icon: '🎬', color: '#9D4EDD' },
];

export const PasswordProvider = ({ children }) => {
  const [passwords, setPasswords] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [masterKey, setMasterKey] = useState(null);

  // Cargar contraseñas y categorías al abrir la app
  useEffect(() => {
    loadPasswords();
    loadCategories();
  }, []);

  const loadPasswords = async () => {
    try {
      const data = await AsyncStorage.getItem('passwords');
      if (data) {
        const parsedPasswords = JSON.parse(data);
        setPasswords(parsedPasswords);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando contraseñas:', error);
      setLoading(false);
    }
  };

  // Función para desencriptar contraseña para visualización
  const getDecryptedPassword = async (encryptedPassword) => {
    if (!masterKey || !encryptedPassword) return '';
    try {
      const decrypted = require('crypto-js').AES.decrypt(encryptedPassword, masterKey).toString(require('crypto-js').enc.Utf8);
      return decrypted || '';
    } catch (error) {
      console.error('Error desencriptando:', error);
      return '';
    }
  };

  const loadCategories = async () => {
    try {
      const data = await AsyncStorage.getItem('categories');
      if (data) {
        setCategories(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const savePasswords = async (data) => {
    try {
      await AsyncStorage.setItem('passwords', JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando contraseñas:', error);
    }
  };

  const saveCategories = async (data) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando categorías:', error);
    }
  };

  // Agregar nueva contraseña
  const addPassword = useCallback((pageName, usuario, password, icon = '🔐', faviconUrl = null, categoryId = '1') => {
    let encryptedPassword = password;
    
    if (masterKey) {
      // Encriptación simple con base64
      try {
        const combined = password + ':' + masterKey;
        encryptedPassword = btoa(combined);
      } catch (e) {
        encryptedPassword = password;
      }
    }
    
    const newPassword = {
      id: generateId(),
      pageName,
      usuario,
      password: encryptedPassword,
      icon,
      faviconUrl,
      categoryId,
      createdAt: new Date().toISOString(),
    };
    const newList = [...passwords, newPassword];
    setPasswords(newList);
    savePasswords(newList);
  }, [passwords, masterKey]);

  // Actualizar contraseña
  const updatePassword = useCallback((id, pageName, usuario, password, icon = '🔐', faviconUrl = null, categoryId = '1') => {
    let encryptedPassword = password;
    
    if (masterKey) {
      // Encriptación simple con base64
      try {
        const combined = password + ':' + masterKey;
        encryptedPassword = btoa(combined);
      } catch (e) {
        encryptedPassword = password;
      }
    }
      
    const newList = passwords.map((item) =>
      item.id === id ? { ...item, pageName, usuario, password: encryptedPassword, icon, faviconUrl, categoryId } : item
    );
    setPasswords(newList);
    savePasswords(newList);
  }, [passwords, masterKey]);

  // Eliminar contraseña
  const deletePassword = useCallback((id) => {
    const newList = passwords.filter((item) => item.id !== id);
    setPasswords(newList);
    savePasswords(newList);
  }, [passwords]);

  // Agregar categoría
  const addCategory = useCallback((name, icon, color) => {
    const newCategory = {
      id: generateId(),
      name,
      icon,
      color,
    };
    const newList = [...categories, newCategory];
    setCategories(newList);
    saveCategories(newList);
  }, [categories]);

  // Eliminar categoría
  const deleteCategory = useCallback((id) => {
    const newList = categories.filter((item) => item.id !== id);
    setCategories(newList);
    saveCategories(newList);
  }, [categories]);

  // Obtener categoría por ID
  const getCategoryById = useCallback((categoryId) => {
    return categories.find((cat) => cat.id === categoryId);
  }, [categories]);

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        categories,
        loading,
        masterKey,
        setMasterKey,
        addPassword,
        updatePassword,
        deletePassword,
        addCategory,
        deleteCategory,
        getCategoryById,
        loadPasswords,
        groupPasswords,
        getGroupForPassword,
        getDecryptedPassword,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};
