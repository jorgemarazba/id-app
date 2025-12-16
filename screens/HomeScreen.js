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
} from 'react-native';
import { PasswordContext } from '../context/PasswordContext';
import { ThemeContext } from '../context/ThemeContext';
import PasswordCard from '../components/PasswordCard';
import AddPasswordModal from '../components/AddPasswordModal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { passwords, loading, deletePassword, groupPasswords } = useContext(PasswordContext);
  const { theme } = useContext(ThemeContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);

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

  // Preparar datos para SectionList
  const getGroupedData = () => {
    const grouped = groupPasswords(passwords);
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
});
