import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Image } from "react-native";
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { SplashScreen } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

import { ApiProvider } from "../context/auth";

const cacheFonts = (fonts: any) => fonts.map((font: any) => Font.loadAsync(font));

const cacheImages = (images: any) => images.map((image: any) => {
  if (typeof image === 'string') {
    return Image.prefetch(image);
  } else {
    return Asset.fromModule(image).downloadAsync();
  }
})

export default function AppLayout() {
  const [appReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const imageAssets = cacheImages([
          require('../assets/plausible_logo.png'),
          require('../assets/plausible_logo_dark.png'),
        ]);

        const fontAssets = cacheFonts([Ionicons.font]);

        await Promise.all([...imageAssets, ...fontAssets]);
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, [])

  return (
    <ApiProvider>
      <StatusBar />
      <Stack initialRouteName="index" />
    </ApiProvider>
  );
}