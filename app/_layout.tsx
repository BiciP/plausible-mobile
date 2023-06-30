import React from "react";
import { Stack } from "expo-router";

import { ApiProvider } from "../context/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function AppLayout() {
  return (
    <ApiProvider>
      <StatusBar />
      <Stack initialRouteName="index" />
    </ApiProvider>
  );
}