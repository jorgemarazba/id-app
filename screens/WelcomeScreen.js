import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PasswordContext } from '../context/PasswordContext';
import { ThemeContext } from '../context/ThemeContext';
import AddPasswordModal from '../components/AddPasswordModal';

export default function WelcomeScreen({ navigation }) {
  const { passwords } = useContext(PasswordContext);
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddPassword = () => {
    setModalVisible(true);
  };

  const handleSearchPasswords = () => {
    navigation.navigate('Home');
  };

  const handleCheckPasswords = () => {
    Alert.alert(
      'Verificación de Contraseñas',
      'Revisa tus contraseñas guardadas para reforzar tu seguridad',
      [{ text: 'OK', onPress: () => navigation.navigate('Home') }]
    );
  };

  const weakPasswords = passwords.filter((p) => p.password.length < 8).length;
  const reusedPasswords = 0; // Placeholder

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Header con botón de tema */}
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.appTitle, { color: theme.text }]}>🔐 Gestor de Contraseñas</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={24}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Barra de Búsqueda */}
      <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar contraseñas"
          placeholderTextColor={theme.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => navigation.navigate('Home')}
        />
      </View>

      {/* Banner de Revisión de Seguridad */}
      <View style={[styles.banner, { backgroundColor: theme.primaryLight }]}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerIconContainer}>
            <Ionicons name="shield-checkmark" size={48} color={theme.primary} />
          </View>
          <View style={styles.bannerText}>
            <Text style={[styles.bannerTitle, { color: isDarkMode ? theme.primary : '#1976D2' }]}>Revisión de contraseñas</Text>
            <Text style={[styles.bannerDescription, { color: theme.textSecondary }]}>
              Comprueba tus contraseñas guardadas para reforzar tu seguridad y mejorar tu protección online
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.checkButton, { backgroundColor: theme.primary }]}
          onPress={handleCheckPasswords}
        >
          <Text style={styles.checkButtonText}>Comprobar contraseñas</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Contraseñas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contraseñas</Text>
          <TouchableOpacity onPress={handleAddPassword}>
            <Text style={[styles.addButton, { color: theme.primary }]}>+ Añadir</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionDescription, { color: theme.textSecondary }]}>
          Crea, guarda y gestiona tus contraseñas para iniciar sesión fácilmente en sitios y aplicaciones.
        </Text>

        {/* Resumen de Contraseñas */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconBg, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="key" size={24} color={theme.primary} />
            </View>
            <Text style={[styles.summaryValue, { color: theme.text }]}>{passwords.length}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>Contraseñas</Text>
          </View>

          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconBg, { backgroundColor: theme.dangerLight }]}>
              <Ionicons name="warning" size={24} color={theme.danger} />
            </View>
            <Text style={[styles.summaryValue, { color: theme.text }]}>0</Text>
            <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>Débiles</Text>
          </View>

          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconBg, { backgroundColor: theme.warningLight }]}>
              <Ionicons name="shield" size={24} color={theme.warning} />
            </View>
            <Text style={[styles.summaryValue, { color: theme.text }]}>{passwords.length}</Text>
            <Text style={[styles.summaryLabel, { color: theme.textTertiary }]}>Seguras</Text>
          </View>
        </View>

        {/* Botón para ir a Contraseñas */}
        <TouchableOpacity
          style={[styles.viewAllButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.viewAllButtonText, { color: theme.primary }]}>Ver todas las contraseñas</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Tips de Seguridad */}
      <View style={styles.tipsSection}>
        <Text style={[styles.tipsSectionTitle, { color: theme.text }]}>Consejos de Seguridad</Text>

        <View style={[styles.tipItem, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.tipNumber, { backgroundColor: theme.primary }]}>
            <Text style={styles.tipNumberText}>1</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: theme.text }]}>Usa contraseñas fuertes</Text>
            <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
              Combina mayúsculas, minúsculas, números y símbolos
            </Text>
          </View>
        </View>

        <View style={[styles.tipItem, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.tipNumber, { backgroundColor: theme.primary }]}>
            <Text style={styles.tipNumberText}>2</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: theme.text }]}>No reutilices contraseñas</Text>
            <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
              Usa contraseñas únicas para cada sitio o aplicación
            </Text>
          </View>
        </View>

        <View style={[styles.tipItem, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.tipNumber, { backgroundColor: theme.primary }]}>
            <Text style={styles.tipNumberText}>3</Text>
          </View>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: theme.text }]}>Actualiza regularmente</Text>
            <Text style={[styles.tipDescription, { color: theme.textSecondary }]}>
              Cambia tus contraseñas cada cierto tiempo
            </Text>
          </View>
        </View>
      </View>

      <AddPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingPassword={null}
      />
    </ScrollView>
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
  appTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  themeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#333',
  },
  banner: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  bannerIconContainer: {
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976D2',
    marginBottom: 4,
  },
  bannerDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  checkButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  checkButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
    lineHeight: 18,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  summaryIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  viewAllButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  tipsSection: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  tipsSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
  },
  tipNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipNumberText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
