import React, { useContext, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SectionList,
  TextInput,
} from 'react-native';
import { PasswordContext } from '../context/PasswordContext';
import { ThemeContext } from '../context/ThemeContext';
import PasswordCard from '../components/PasswordCard';
import AddPasswordModal from '../components/AddPasswordModal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { passwords, loading, deletePassword, groupPasswords, getGroupForPassword } = useContext(PasswordContext);
  const { theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = (id) => {
    Alert.alert('Eliminar contraseña', '¿Estás seguro de que deseas eliminarla?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Eliminar',
        onPress: () => deletePassword(id),
        style: 'destructive',
      },
    ]);
  };

  const handleEdit = (password) => {
    setEditingPassword(password);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingPassword(null);
    setModalVisible(true);
  };

  // Filtrar contraseñas según búsqueda
  const getFilteredPasswords = () => {
    if (!searchQuery.trim()) return passwords;
    
    const query = searchQuery.toLowerCase();
    return passwords.filter((password) => {
      const usuario = (password.usuario || '').toLowerCase();
      const pageName = (password.pageName || '').toLowerCase();
      const service = (getGroupForPassword(password.pageName) || '').toLowerCase();
      
      return usuario.includes(query) || pageName.includes(query) || service.includes(query);
    });
  };

  // Preparar datos para SectionList
  const getGroupedData = () => {
    const filtered = getFilteredPasswords();
    const grouped = groupPasswords(filtered);
    return Object.entries(grouped).map(([group, items]) => ({
      title: group,
      data: items,
    }));
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const groupedData = getGroupedData();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header con botón de Seguridad */}
      <View style={[styles.topBar, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.navigate('BiometricAuth')}>
          <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: theme.text }]}>Mis Contraseñas</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Barra de Búsqueda */}
      <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Buscar por usuario, sitio o servicio"
          placeholderTextColor={theme.placeholderText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <SectionList
        sections={groupedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PasswordCard
            password={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={[styles.sectionHeader, { backgroundColor: theme.sectionHeader }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="lock-closed-outline" size={64} color={theme.textTertiary} />
            <Text style={[styles.emptyText, { color: theme.text }]}>No hay contraseñas guardadas</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
              Toca el botón + para agregar tu primera contraseña
            </Text>
          </View>
        }
        contentContainerStyle={passwords.length === 0 && styles.emptyListContent}
      />

      <TouchableOpacity style={[styles.floatingButton, { backgroundColor: theme.primary }]} onPress={handleAddNew}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <AddPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingPassword={editingPassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 60,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
});
