import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';
import { verifyMasterPassword, masterPasswordExists, saveMasterPassword, generateMasterKey } from '../services/encryptionService';
import { PasswordContext } from '../context/PasswordContext';

export default function MasterPasswordScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { setMasterKey } = useContext(PasswordContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNewPassword, setIsNewPassword] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfMasterPasswordExists();
  }, []);

  const checkIfMasterPasswordExists = async () => {
    try {
      const exists = await masterPasswordExists();
      setIsNewPassword(!exists);
      setLoading(false);
    } catch (error) {
      console.error('Error checking master password:', error);
      setLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa una contraseña maestra');
      return;
    }

    if (isNewPassword && password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña maestra debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await saveMasterPassword(password);
      
      // Guardar la clave maestra en el contexto
      const masterKey = await generateMasterKey(password);
      setMasterKey(masterKey);
      
      navigation.replace('Welcome');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la contraseña maestra');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña maestra');
      return;
    }

    try {
      setLoading(true);
      const isValid = await verifyMasterPassword(password);
      
      if (isValid) {
        // Guardar la clave maestra en el contexto
        const masterKey = await generateMasterKey(password);
        setMasterKey(masterKey);
        navigation.replace('Welcome');
      } else {
        Alert.alert('Error', 'Contraseña maestra incorrecta');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al verificar contraseña');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="lock-closed" size={64} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>
            {isNewPassword ? 'Crear Contraseña Maestra' : 'Contraseña Maestra'}
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {isNewPassword
              ? 'Esta contraseña protege todas tus contraseñas guardadas'
              : 'Ingresa tu contraseña maestra para acceder'}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Campo de Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>
              {isNewPassword ? 'Nueva Contraseña Maestra' : 'Contraseña Maestra'}
            </Text>
            <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.cardBackground }]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Ingresa una contraseña segura"
                placeholderTextColor={theme.placeholderText}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color={theme.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campo de Confirmación (solo para nueva contraseña) */}
          {isNewPassword && (
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.text }]}>Confirmar Contraseña</Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border, backgroundColor: theme.cardBackground }]}>
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirma tu contraseña"
                  placeholderTextColor={theme.placeholderText}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color={theme.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Tips de Seguridad */}
          <View style={[styles.tipsContainer, { backgroundColor: theme.primaryLight }]}>
            <Ionicons name="information-circle" size={24} color={theme.primary} />
            <Text style={[styles.tipsText, { color: theme.text }]}>
              {isNewPassword
                ? 'Usa una contraseña única y segura que no uses en otros lugares'
                : 'Tu contraseña maestra no se puede recuperar. Guárdala en un lugar seguro'}
            </Text>
          </View>
        </View>

        {/* Botón */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary, opacity: loading ? 0.6 : 1 }]}
          onPress={isNewPassword ? handleSetPassword : handleVerifyPassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Procesando...' : isNewPassword ? 'Crear Contraseña' : 'Acceder'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  tipsContainer: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  tipsText: {
    fontSize: 13,
    color: '#1976D2',
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
