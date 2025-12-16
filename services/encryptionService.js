import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Generar una clave maestra a partir de la contraseña maestra
export const generateMasterKey = async (masterPassword) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    masterPassword
  );
  return digest;
};

// Encriptar contraseña usando base64
export const encryptPassword = async (password, masterKey) => {
  try {
    // Usar el masterKey como parte de la encriptación
    const combined = password + ':' + masterKey;
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      combined
    );
    // Convertir a base64 para almacenamiento
    const encoded = Buffer.from(digest + '|' + password).toString('base64');
    return encoded;
  } catch (error) {
    console.error('Error encrypting password:', error);
    return password;
  }
};

// Desencriptar contraseña
export const decryptPassword = async (encryptedPassword, masterKey) => {
  try {
    if (!encryptedPassword || encryptedPassword.length === 0) {
      return '';
    }
    
    // Decodificar de base64
    const decoded = Buffer.from(encryptedPassword, 'base64').toString('utf8');
    const [, password] = decoded.split('|');
    
    return password || '';
  } catch (error) {
    console.error('Error decrypting password:', error);
    return '';
  }
};

// Guardar contraseña maestra (se guarda hasheada)
export const saveMasterPassword = async (masterPassword) => {
  try {
    const hashedPassword = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      masterPassword
    );
    await AsyncStorage.setItem('masterPasswordHash', hashedPassword);
    return true;
  } catch (error) {
    console.error('Error saving master password:', error);
    return false;
  }
};

// Verificar contraseña maestra
export const verifyMasterPassword = async (masterPassword) => {
  try {
    const storedHash = await AsyncStorage.getItem('masterPasswordHash');
    if (!storedHash) return false;
    
    const inputHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      masterPassword
    );
    return inputHash === storedHash;
  } catch (error) {
    console.error('Error verifying master password:', error);
    return false;
  }
};

// Verificar si existe contraseña maestra
export const masterPasswordExists = async () => {
  try {
    const hash = await AsyncStorage.getItem('masterPasswordHash');
    return !!hash;
  } catch (error) {
    console.error('Error checking master password:', error);
    return false;
  }
};
