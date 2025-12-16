import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function BiometricAuthScreen({ navigation }) {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBiometricAvailability();
    checkBiometricStatus();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricAvailable(compatible);

      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        const typeNames = types
          .map((type) => {
            if (type === LocalAuthentication.AuthenticationType.FINGERPRINT) return 'Huella Digital';
            if (type === LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) return 'Reconocimiento Facial';
            if (type === LocalAuthentication.AuthenticationType.IRIS) return 'Escaneo de Iris';
            return 'Biometría';
          })
          .join(', ');
        setBiometricType(typeNames);
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const checkBiometricStatus = async () => {
    try {
      const isEnabled = await AsyncStorage.getItem('biometricEnabled');
      setIsBiometricEnabled(isEnabled === 'true');
      setLoading(false);
    } catch (error) {
      console.error('Error checking biometric status:', error);
      setLoading(false);
    }
  };

  const enableBiometric = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        reason: 'Verifica tu identidad para habilitar autenticación biométrica',
        fallbackLabel: 'Usa tu passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        await AsyncStorage.setItem('biometricEnabled', 'true');
        setIsBiometricEnabled(true);
        Alert.alert('Éxito', 'Autenticación biométrica habilitada');
      } else {
        Alert.alert('Cancelado', 'La autenticación biométrica no fue habilitada');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar tu identidad');
      console.error('Biometric authentication error:', error);
    }
  };

  const disableBiometric = async () => {
    Alert.alert(
      'Deshabilitar Biometría',
      '¿Estás seguro de que deseas desactivar la autenticación biométrica?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deshabilitar',
          onPress: async () => {
            await AsyncStorage.setItem('biometricEnabled', 'false');
            setIsBiometricEnabled(false);
            Alert.alert('Éxito', 'Autenticación biométrica deshabilitada');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleToggleBiometric = () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        'No Disponible',
        'Tu dispositivo no soporta autenticación biométrica'
      );
      return;
    }

    if (isBiometricEnabled) {
      disableBiometric();
    } else {
      enableBiometric();
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.text }]}>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Seguridad</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Ionicons name={isDarkMode ? 'sunny' : 'moon'} size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Sección Biometría */}
        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="finger-print" size={28} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Autenticación Biométrica</Text>
          </View>

          {isBiometricAvailable ? (
            <>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                Usa {biometricType} para acceder rápidamente a tu gestor de contraseñas sin escribir tu PIN.
              </Text>

              <View style={styles.toggleContainer}>
                <View>
                  <Text style={[styles.toggleLabel, { color: theme.text }]}>
                    {isBiometricEnabled ? 'Habilitado' : 'Deshabilitado'}
                  </Text>
                  <Text style={[styles.toggleSubtitle, { color: theme.textSecondary }]}>
                    {biometricType}
                  </Text>
                </View>
                <Switch
                  value={isBiometricEnabled}
                  onValueChange={handleToggleBiometric}
                  trackColor={{ false: theme.border, true: theme.primaryLight }}
                />
              </View>

              {isBiometricEnabled && (
                <View style={[styles.statusBox, { backgroundColor: theme.successLight }]}>
                  <Ionicons name="checkmark-circle" size={20} color={theme.success || '#34C759'} />
                  <Text style={[styles.statusText, { color: '#34C759' }]}>
                    Autenticación biométrica activada
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={[styles.unavailableBox, { backgroundColor: theme.dangerLight }]}>
              <Ionicons name="alert-circle" size={24} color={theme.danger || '#FF3B30'} />
              <View style={styles.unavailableContent}>
                <Text style={[styles.unavailableTitle, { color: theme.danger || '#FF3B30' }]}>
                  No Disponible
                </Text>
                <Text style={[styles.unavailableText, { color: theme.textSecondary }]}>
                  Tu dispositivo no soporta autenticación biométrica
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Información de Seguridad */}
        <View style={[styles.infoSection, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>Consejos de Seguridad</Text>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              La biometría nunca se almacena en la nube
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Tus datos están completamente seguros en el dispositivo
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={theme.primary} />
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Puedes desactivar la biometría en cualquier momento
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: '#999',
  },
  statusBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34C759',
  },
  unavailableBox: {
    backgroundColor: '#FFE5E5',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  unavailableContent: {
    flex: 1,
  },
  unavailableTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 2,
  },
  unavailableText: {
    fontSize: 12,
    color: '#666',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
    lineHeight: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
});
