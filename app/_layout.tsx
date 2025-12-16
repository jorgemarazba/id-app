import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PasswordProvider } from '../context/PasswordContext';
import { ThemeProvider } from '../context/ThemeContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import { SafeAreaView, StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

function RootNavigator() {
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
    >
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
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PasswordProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
          <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
          <RootNavigator />
        </SafeAreaView>
      </PasswordProvider>
    </ThemeProvider>
  );
}


