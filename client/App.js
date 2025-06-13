import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, ScrollView, View, StyleSheet, Text } from 'react-native';

import Home from './views/home/Home.js';
import Register from './views/auth/Register.js';
import Login from './views/auth/Login.js';
import ResetPassword from './views/auth/ResetPassword.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeWrapper}
          options={{ title: 'Finance Manager' }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: 'Kayıt Ol' }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'Giriş Yap' }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{ title: 'Şifreyi sıfırla' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Home bileşeni için bir sarmalayıcı, kaydırılabilirlik eklenir
function HomeWrapper() {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Home />
    </ScrollView>
  );
}

// Stil dosyası
const styles = StyleSheet.create({
  text: {
    fontSize: 16, // Varsayılan font boyutu
    fontWeight: '400', // Varsayılan font ağırlığı
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    padding: 16,
    backgroundColor: '#fff',
  },
});
