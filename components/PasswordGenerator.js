import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Clipboard from '@react-native-clipboard/clipboard';

const PasswordGenerator = ({ theme, onPasswordGenerated }) => {
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = () => {
    let chars = '';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars.length === 0) {
      Alert.alert('Error', 'Selecciona al menos un tipo de carácter');
      return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setGeneratedPassword(password);
    if (onPasswordGenerated) {
      onPasswordGenerated(password);
    }
  };

  const copyPassword = () => {
    if (generatedPassword) {
      Clipboard.setString(generatedPassword);
      Alert.alert('Copiado', 'Contraseña copiada al portapapeles');
    }
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length < 8) return { text: 'Débil', color: '#FF3B30' };
    if (pwd.length < 12) return { text: 'Media', color: '#FF9500' };
    if (pwd.length < 16) return { text: 'Fuerte', color: '#34C759' };
    return { text: 'Muy Fuerte', color: '#0A84FF' };
  };

  const strength = generatedPassword ? getPasswordStrength(generatedPassword) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.text }]}>Generador de Contraseñas</Text>

      {/* Longitud */}
      <View style={styles.section}>
        <View style={styles.lengthHeader}>
          <Text style={[styles.label, { color: theme.text }]}>Longitud: {length}</Text>
          <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
        </View>
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderValue, { color: theme.textSecondary }]}>4</Text>
          <View style={[styles.slider, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.sliderFill,
                {
                  backgroundColor: theme.primary,
                  width: `${((length - 4) / 28) * 100}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.sliderValue, { color: theme.textSecondary }]}>32</Text>
        </View>
        <TextInput
          style={[styles.lengthInput, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
          value={length.toString()}
          onChangeText={(text) => {
            const num = parseInt(text) || 12;
            if (num >= 4 && num <= 32) setLength(num);
          }}
          keyboardType="numeric"
        />
      </View>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        <OptionRow
          label="Mayúsculas (ABC)"
          value={includeUppercase}
          onToggle={setIncludeUppercase}
          theme={theme}
        />
        <OptionRow
          label="Minúsculas (abc)"
          value={includeLowercase}
          onToggle={setIncludeLowercase}
          theme={theme}
        />
        <OptionRow
          label="Números (123)"
          value={includeNumbers}
          onToggle={setIncludeNumbers}
          theme={theme}
        />
        <OptionRow
          label="Símbolos (!@#)"
          value={includeSymbols}
          onToggle={setIncludeSymbols}
          theme={theme}
        />
      </View>

      {/* Botón Generar */}
      <TouchableOpacity
        style={[styles.generateButton, { backgroundColor: theme.primary }]}
        onPress={generatePassword}
      >
        <Ionicons name="refresh" size={20} color="white" />
        <Text style={styles.generateButtonText}>Generar Contraseña</Text>
      </TouchableOpacity>

      {/* Contraseña Generada */}
      {generatedPassword && (
        <View style={[styles.resultContainer, { backgroundColor: theme.inputBackground }]}>
          <View style={styles.resultHeader}>
            <Text style={[styles.generatedPassword, { color: theme.text }]}>
              {generatedPassword.substring(0, 20)}
              {generatedPassword.length > 20 ? '...' : ''}
            </Text>
            <TouchableOpacity onPress={copyPassword}>
              <Ionicons name="copy" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.strengthBar}>
            <Text style={[styles.strengthLabel, { color: theme.textSecondary }]}>
              Fortaleza:{' '}
              <Text style={{ color: strength.color, fontWeight: '700' }}>
                {strength.text}
              </Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const OptionRow = ({ label, value, onToggle, theme }) => (
  <View style={styles.optionRow}>
    <Text style={[styles.optionLabel, { color: theme.text }]}>{label}</Text>
    <Switch value={value} onValueChange={onToggle} trackColor={{ false: theme.border, true: theme.primaryLight }} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  lengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  slider: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
  },
  sliderValue: {
    fontSize: 12,
    width: 20,
  },
  lengthInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 16,
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  generateButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  generateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  generatedPassword: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '600',
    flex: 1,
  },
  strengthBar: {
    marginTop: 8,
  },
  strengthLabel: {
    fontSize: 12,
  },
});

export default PasswordGenerator;
