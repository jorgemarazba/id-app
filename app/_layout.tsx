import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PasswordProvider } from '../context/PasswordContext';
import { ThemeProvider } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LockScreen from '../screens/LockScreen';
import MasterPasswordScreen from '../screens/MasterPasswordScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import BiometricAuthScreen from '../screens/BiometricAuthScreen';
import { SafeAreaView, StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

function RootNavigator({ initialRoute, onNavigateAway }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        },
        headerTintColor: '#333',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen
        name="MasterPassword"
        component={MasterPasswordScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Lock"
        component={LockScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Mis Contraseñas',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="BiometricAuth"
        component={BiometricAuthScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState('Lock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      // Primero verifica si existe contraseña maestra
      const masterPasswordHash = await AsyncStorage.getItem('masterPasswordHash');
      if (!masterPasswordHash) {
        // Si no existe contraseña maestra, ir a crear una
        setInitialRoute('MasterPassword');
        setLoading(false);
        return;
      }

      // Si existe contraseña maestra, verificar biometría
      const isBiometricEnabled = await AsyncStorage.getItem('biometricEnabled');
      if (isBiometricEnabled === 'true') {
        setInitialRoute('Lock');
      } else {
        setInitialRoute('Welcome');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking status:', error);
      setInitialRoute('MasterPassword');
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider>
      <PasswordProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <RootNavigator initialRoute={initialRoute} />
        </SafeAreaView>
      </PasswordProvider>
    </ThemeProvider>
  );
}


