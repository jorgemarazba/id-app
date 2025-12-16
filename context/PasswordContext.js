import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const PasswordProvider = ({ children }) => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar contraseñas al abrir la app
  useEffect(() => {
    loadPasswords();
  }, []);

  const loadPasswords = async () => {
    try {
      const data = await AsyncStorage.getItem('passwords');
      if (data) {
        setPasswords(JSON.parse(data));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error cargando contraseñas:', error);
      setLoading(false);
    }
  };

  const savePasswords = async (data) => {
    try {
      await AsyncStorage.setItem('passwords', JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando contraseñas:', error);
    }
  };

  // Agregar nueva contraseña
  const addPassword = useCallback((pageName, usuario, password, icon = '🔐', faviconUrl = null) => {
    const newPassword = {
      id: generateId(),
      pageName,
      usuario,
      password,
      icon,
      faviconUrl,
      createdAt: new Date().toISOString(),
    };
    const newList = [...passwords, newPassword];
    setPasswords(newList);
    savePasswords(newList);
  }, [passwords]);

  // Actualizar contraseña
  const updatePassword = useCallback((id, pageName, usuario, password, icon = '🔐', faviconUrl = null) => {
    const newList = passwords.map((item) =>
      item.id === id ? { ...item, pageName, usuario, password, icon, faviconUrl } : item
    );
    setPasswords(newList);
    savePasswords(newList);
  }, [passwords]);

  // Eliminar contraseña
  const deletePassword = useCallback((id) => {
    const newList = passwords.filter((item) => item.id !== id);
    setPasswords(newList);
    savePasswords(newList);
  }, [passwords]);

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        loading,
        addPassword,
        updatePassword,
        deletePassword,
        loadPasswords,
        groupPasswords,
        getGroupForPassword,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};
