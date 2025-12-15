import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { PasswordProvider } from '../context/PasswordContext';
import HomeScreen from '../screens/HomeScreen';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <PasswordProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔐 Gestor de Contraseñas</Text>
        </View>
        <HomeScreen />
      </SafeAreaView>
    </PasswordProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
});
