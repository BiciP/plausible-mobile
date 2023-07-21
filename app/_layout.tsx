import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, Image, Text, Platform } from "react-native";
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { SplashScreen } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ApiProvider } from "../context/auth";
import { useColors } from "../hooks/useStyle";
import RangePicker from "../components/RangePicker";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import RangeModal from "../components/RangeModal";

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
  const colors = useColors()

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // await AsyncStorage.clear() // lunagpt.io

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
    <SafeAreaProvider>
      <ApiProvider>
        <BottomSheetModalProvider>
          <StatusBar />

          <Stack
            screenOptions={{
              headerTransparent: true,
              headerBlurEffect: 'systemUltraThinMaterial',
              headerTintColor: colors.text,
              headerRight: RangePicker
            }}
            initialRouteName="index"
          />

          <RangeModal />
        </BottomSheetModalProvider>
      </ApiProvider>
    </SafeAreaProvider>
  );
}