import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { ExpenseProvider } from '@/contexts/ExpenseContext'; 
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ExpenseProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "menü" }} />
        <Stack.Screen name="auth/login" options={{ headerShown: true, title: "Giriş yap" }} />
        <Stack.Screen name="auth/register" options={{ headerShown: true, title: "Kayıt ol" }} />
        <Stack.Screen name="auth/reset-password" options={{ headerShown: true, title: "Parola sıfırla" }} />
        <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ExpenseProvider>
  );
}
  