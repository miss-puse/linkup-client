import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
      screenOptions={{
          headerStyle: {
            backgroundColor: '#a020f0',
          }}}
          >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ presentation: 'modal' }} />
        <Stack.Screen name="Signup"/>
        <Stack.Screen name="Login"/>
        <Stack.Screen name="completeprofile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="editprofile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="editimage" options={{ presentation: 'modal' }} />
        <Stack.Screen name="chatscreen" options={{ presentation: 'modal' }} />
        <Stack.Screen name="userprofile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="previewprofile" options={{ presentation: 'modal' }} />
        <Stack.Screen name="editpreferences" options={{ presentation: 'modal' }} />
        <Stack.Screen name="emergencycontacts" options={{ presentation: 'modal' }} />
        <Stack.Screen name="createemergencycontact" options={{ presentation: 'modal' }} />
        <Stack.Screen name="updateemergencycontact" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
