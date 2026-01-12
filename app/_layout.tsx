import '../global.css';
import { useFonts, Outfit_400Regular, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { Alert } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [loaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
  });

  useEffect(() => {
    // Global Error Handler for Crash Reporting
    const errorHandler = (error: Error, isFatal?: boolean) => {
      console.error('Captured Global Error:', error);
      if (isFatal) {
        Alert.alert(
          'Unexpected Error',
          'The app encountered a critical error. Would you like to report it via email?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Report',
              onPress: () => {
                const email = 'support@example.com';
                const subject = 'LightsOut Crash Report';
                const body = `Error: ${error.message}\n\nStack:\n${error.stack}`;
                Linking.openURL(
                  `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
                );
              },
            },
          ]
        );
      }
    };

    // @ts-ignore
    global.ErrorUtils?.setGlobalHandler(errorHandler);
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
