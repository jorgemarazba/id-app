import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Clipboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PasswordCard({ password, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    Alert.alert('Copiado', `${label} copiado al portapapeles`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {password.faviconUrl && !faviconError ? (
            <Image
              source={{ uri: password.faviconUrl }}
              style={styles.faviconImage}
              onError={() => setFaviconError(true)}
            />
          ) : (
            <Text style={styles.icon}>{password.icon || '🔐'}</Text>
          )}
        </View>
        <Text style={styles.siteName}>{password.pageName}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.label}>Usuario/Correo:</Text>
        <TouchableOpacity
          onPress={() => copyToClipboard(password.usuario, 'Usuario')}
          style={styles.valueContainer}
        >
          <Text style={styles.value}>{password.usuario}</Text>
          <Ionicons name="copy" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Contraseña:</Text>
        <View style={styles.passwordRow}>
          <Text style={styles.value}>
            {showPassword ? password.password : '•'.repeat(password.password.length)}
          </Text>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={16}
              color="#007AFF"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => copyToClipboard(password.password, 'Contraseña')}
          >
            <Ionicons name="copy" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(password)}
        >
          <Ionicons name="pencil" size={16} color="white" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(password.id)}
        >
          <Ionicons name="trash" size={16} color="white" />
          <Text style={styles.actionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  faviconImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  fallbackIcon: {
    fontSize: 28,
  },
  siteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 12,
  },
  row: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
