import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_600SemiBold,
} from '@expo-google-fonts/playfair-display';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
} from '@expo-google-fonts/dm-sans';

// Hold the splash screen until fonts are ready.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    // ── Playfair Display (headings) ────────────────────────────────────
    // Keys must match fontFamilies constants in theme/typography.ts
    'PlayfairDisplay-Bold':     PlayfairDisplay_700Bold,
    'PlayfairDisplay-SemiBold': PlayfairDisplay_600SemiBold,

    // ── DM Sans (UI & body) ────────────────────────────────────────────
    'DMSans-Regular':   DMSans_400Regular,
    'DMSans-Medium':    DMSans_500Medium,
    'DMSans-SemiBold':  DMSans_600SemiBold,
  });

  useEffect(() => {
    // Hide splash once fonts are loaded (or on font load failure —
    // the app still renders with system fallback fonts).
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Block render until fonts are ready to avoid flash of unstyled text.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
