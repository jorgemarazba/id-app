import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';

export default function LockScreen() {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [biometricType, setBiometricType] = useState('Huella Digital');
  const [attemptCount, setAttemptCount] = useState(0);
  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    checkBiometricType();
    // Intentar autenticar automáticamente al abrir
    setTimeout(() => {
      handleBiometricAuth();
    }, 500);
  }, []);

  const checkBiometricType = async () => {
    try {
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
    } catch (error) {
      console.error('Error checking biometric type:', error);
    }
  };

  const handleBiometricAuth = async () => {
    if (attemptCount >= MAX_ATTEMPTS) {
      Alert.alert(
        'Demasiados intentos',
        'Has superado el número máximo de intentos. Intenta más tarde.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Aquí podrías implementar un tiempo de espera o similar
            },
          },
        ]
      );
      return;
    }

    setIsAuthenticating(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        reason: `Verifica con tu ${biometricType.toLowerCase()} para acceder`,
        fallbackLabel: 'Usa tu passcode',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setIsAuthenticating(false);
        // Navegar a Welcome después de autenticación exitosa
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        }, 300);
      } else {
        setIsAuthenticating(false);
        setAttemptCount(attemptCount + 1);
        if (attemptCount + 1 < MAX_ATTEMPTS) {
          Alert.alert(
            'Autenticación fallida',
            `Intento ${attemptCount + 1}/${MAX_ATTEMPTS}`
          );
        }
      }
    } catch (error) {
      setIsAuthenticating(false);
      Alert.alert('Error', 'No se pudo verificar tu identidad');
      console.error('Biometric authentication error:', error);
      setAttemptCount(attemptCount + 1);
    }
  };

  const handleDisableBiometric = async () => {
    Alert.alert(
      'Deshabilitar Seguridad',
      '¿Deseas desactivar la autenticación biométrica?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Deshabilitar',
          onPress: async () => {
            await AsyncStorage.setItem('biometricEnabled', 'false');
            // Navegar a Welcome después de desactivar
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🔐</Text>
        </View>

        {/* Título */}
        <Text style={[styles.title, { color: theme.text }]}>
          Gestor de Contraseñas
        </Text>

        {/* Subtítulo */}
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Verifica tu identidad para continuar
        </Text>

        {/* Estado */}
        <View style={[styles.statusBox, { backgroundColor: theme.cardBackground }]}>
          {isAuthenticating ? (
            <>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.statusText, { color: theme.text }]}>
                Esperando autenticación...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="finger-print" size={60} color={theme.primary} />
              <Text style={[styles.statusText, { color: theme.text }]}>
                {biometricType}
              </Text>
              <Text style={[styles.statusSubtext, { color: theme.textSecondary }]}>
                Toca para autenticar
              </Text>
            </>
          )}
        </View>

        {/* Intentos restantes */}
        {attemptCount > 0 && attemptCount < MAX_ATTEMPTS && (
          <View style={styles.attemptsContainer}>
            <Text style={[styles.attemptsText, { color: theme.textSecondary }]}>
              Intentos restantes: {MAX_ATTEMPTS - attemptCount}
            </Text>
          </View>
        )}

        {/* Botón de Autenticar */}
        <TouchableOpacity
          style={[styles.authButton, { backgroundColor: theme.primary }]}
          onPress={handleBiometricAuth}
          disabled={isAuthenticating || attemptCount >= MAX_ATTEMPTS}
        >
          <Ionicons name="finger-print" size={24} color="white" />
          <Text style={styles.authButtonText}>Autenticar</Text>
        </TouchableOpacity>

        {/* Botón Secundario */}
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.border }]}
          onPress={handleDisableBiometric}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>
            Desactivar Seguridad
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textTertiary }]}>
          Tu información está protegida
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  statusBox: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  statusSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  attemptsContainer: {
    marginBottom: 16,
  },
  attemptsText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
