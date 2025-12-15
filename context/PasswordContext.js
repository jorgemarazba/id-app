import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
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
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
};
