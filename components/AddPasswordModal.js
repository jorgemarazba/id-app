import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PasswordContext } from '../context/PasswordContext';
import { ThemeContext } from '../context/ThemeContext';

const POPULAR_ICONS = [
  '📧', '👤', '🔐', '💻', '🌐', '📱', '💳', '🎮', '📺', '🍎',
  '🔵', '🐦', '📷', '💬', '🎵', '🎬', '👔', '🛒', '🚀', '⚙️',
  '💰', '📊', '✉️', '🔔', '📮', '🎯', '⭐', '🎨', '🔥', '✅'
];

const SITE_DOMAINS = {
  gmail: 'gmail.com',
  mail: 'gmail.com',
  google: 'google.com',
  facebook: 'facebook.com',
  fb: 'facebook.com',
  instagram: 'instagram.com',
  ig: 'instagram.com',
  twitter: 'twitter.com',
  x: 'x.com',
  youtube: 'youtube.com',
  spotify: 'spotify.com',
  netflix: 'netflix.com',
  amazon: 'amazon.com',
  paypal: 'paypal.com',
  github: 'github.com',
  linkedin: 'linkedin.com',
  discord: 'discord.com',
  twitch: 'twitch.tv',
  reddit: 'reddit.com',
  pinterest: 'pinterest.com',
  tiktok: 'tiktok.com',
  snapchat: 'snapchat.com',
  uber: 'uber.com',
  airbnb: 'airbnb.com',
  booking: 'booking.com',
  slack: 'slack.com',
  teams: 'microsoft.com',
  zoom: 'zoom.us',
  skype: 'skype.com',
  outlook: 'outlook.com',
  microsoft: 'microsoft.com',
  apple: 'apple.com',
  windows: 'microsoft.com',
  xbox: 'xbox.com',
  steam: 'steampowered.com',
  epic: 'epicgames.com',
  blizzard: 'blizzard.com',
  coinbase: 'coinbase.com',
  binance: 'binance.com',
  crypto: 'crypto.com',
  bank: 'banking.com',
  wise: 'wise.com',
  revolut: 'revolut.com',
  whatsapp: 'whatsapp.com',
  telegram: 'telegram.org',
  ebay: 'ebay.com',
};

const getDomainFromSiteName = (siteName) => {
  const siteNameLower = siteName.toLowerCase();
  
  for (const [site, domain] of Object.entries(SITE_DOMAINS)) {
    if (siteNameLower.includes(site)) {
      return domain;
    }
  }
  
  return null;
};

const getFaviconUrl = (domain) => {
  return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
};

export default function AddPasswordModal({ visible, onClose, editingPassword }) {
  const [pageName, setPageName] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [icon, setIcon] = useState('🔐');
  const [faviconUrl, setFaviconUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const { addPassword, updatePassword, categories } = useContext(PasswordContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (editingPassword) {
      setPageName(editingPassword.pageName);
      setUsuario(editingPassword.usuario);
      setPassword(editingPassword.password);
      setIcon(editingPassword.icon || '🔐');
      setFaviconUrl(editingPassword.faviconUrl || null);
      setSelectedCategory(editingPassword.categoryId || '1');
    } else {
      resetForm();
    }
  }, [editingPassword, visible]);

  const handlePageNameChange = (text) => {
    setPageName(text);
    if (text.trim()) {
      const domain = getDomainFromSiteName(text);
      
      if (domain) {
        setFaviconUrl(getFaviconUrl(domain));
      } else {
        setFaviconUrl(null);
      }
    }
  };

  const resetForm = () => {
    setPageName('');
    setUsuario('');
    setPassword('');
    setIcon('🔐');
    setFaviconUrl(null);
    setShowPassword(false);
    setShowIconPicker(false);
    setSelectedCategory('1');
  };

  const handleSave = () => {
    if (!pageName.trim() || !usuario.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    if (password.length < 4) {
      Alert.alert('Error', 'La contraseña debe tener al menos 4 caracteres');
      return;
    }

    if (editingPassword) {
      updatePassword(editingPassword.id, pageName, usuario, password, icon, faviconUrl, selectedCategory);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    } else {
      addPassword(pageName, usuario, password, icon, faviconUrl, selectedCategory);
      Alert.alert('Éxito', 'Contraseña guardada correctamente');
    }

    resetForm();
    onClose();
  };

  const generatePassword = () => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {editingPassword ? 'Editar Contraseña' : 'Nueva Contraseña'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre del sitio/aplicación</Text>
              <View style={styles.nameInputWrapper}>
                <View style={styles.iconContainer}>
                  {faviconUrl ? (
                    <Image
                      source={{ uri: faviconUrl }}
                      style={styles.faviconImage}
                    />
                  ) : (
                    <Text style={styles.detectedIcon}>{icon}</Text>
                  )}
                </View>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Ej: Gmail, Facebook, Instagram"
                  value={pageName}
                  onChangeText={handlePageNameChange}
                  placeholderTextColor="#999"
                />
              </View>
              <Text style={styles.helperText}>Se detectará el logo automáticamente</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usuario o Correo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: usuario@gmail.com"
                value={usuario}
                onChangeText={setUsuario}
                placeholderTextColor="#999"
                keyboardType="email-address"
              />
            </View>

            {/* Selector de Categoría */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Categoría</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                <View style={styles.categoryDisplay}>
                  <Text style={styles.categoryEmoji}>
                    {categories.find(c => c.id === selectedCategory)?.icon}
                  </Text>
                  <Text style={styles.categoryName}>
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </Text>
                </View>
                <Ionicons
                  name={showCategoryPicker ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>

              {showCategoryPicker && (
                <View style={styles.categoryList}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryOption,
                        selectedCategory === cat.id && styles.selectedCategory,
                      ]}
                      onPress={() => {
                        setSelectedCategory(cat.id);
                        setShowCategoryPicker(false);
                      }}
                    >
                      <Text style={styles.categoryOptionEmoji}>{cat.icon}</Text>
                      <Text style={styles.categoryOptionName}>{cat.name}</Text>
                      {selectedCategory === cat.id && (
                        <Ionicons name="checkmark" size={20} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.iconButton}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#007AFF"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={generatePassword}
                  style={styles.iconButton}
                >
                  <Ionicons name="refresh" size={20} color="#007AFF" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={generatePassword}
            >
              <Ionicons name="sparkles" size={16} color="white" />
              <Text style={styles.generateButtonText}>
                Generar contraseña segura
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Ionicons name="checkmark" size={18} color="white" />
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nameInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  iconContainer: {
    marginRight: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faviconImage: {
    width: 32,
    height: 32,
  },
  detectedIcon: {
    fontSize: 28,
  },
  nameInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingRight: 8,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 0,
  },
  iconButton: {
    padding: 8,
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  generateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  categoryList: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 4,
    backgroundColor: 'white',
    maxHeight: 200,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#f0f0f0',
  },
  categoryOptionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  categoryOptionName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});
