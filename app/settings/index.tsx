import { useApiContext } from "../../context/auth";
import TextInput from "../../components/TextInput";
import { useColors, useStyle } from "../../hooks/useStyle";
import { Stack } from "expo-router";
import { View, Text, SafeAreaView, Keyboard } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { BorderlessButton, RectButton, TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Settings() {
  const colors = useColors()
  const style = useStyle()

  const { apiKey, setApiKey } = useApiContext()
  const [apiKeyInput, setApiKeyInput] = useState<string>("")

  const handleSaveAPIKey = useCallback(() => {
    setApiKey(apiKeyInput)
  }, [apiKeyInput])

  useEffect(() => {
    setApiKeyInput(apiKey || "")
  }, [apiKey])

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Settings',
        }}
      />

      <SafeAreaView style={{ backgroundColor: colors.background, alignItems: 'center' }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.page}>
            <View>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
                API Key
              </Text>
              <TextInput
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
              />
              <View style={{ marginTop: 10 }}>
                <RectButton
                  onPress={handleSaveAPIKey}
                  style={{
                    ...style.primaryButton,
                    opacity: apiKey === apiKeyInput ? .5 : 1
                  }}
                  enabled={apiKey !== apiKeyInput}
                >
                  <Text style={style.primaryButtonText}>
                    Save API Key
                  </Text>
                </RectButton>
              </View>
            </View>

            <View style={{
              opacity: .5,
              marginTop: 'auto'
            }}>
              <Text style={{ color: colors.text }}>
                Version {require('../../package.json').version}
              </Text>
              <Text style={{ color: colors.text }}>
                Plausible Analytics Mobile App
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  )
}