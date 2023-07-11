import { useApiContext } from "../../context/auth";
import TextInput from "../../components/TextInput";
import { useColors, useStyle } from "../../hooks/useStyle";
import { Stack } from "expo-router";
import { View, Text, SafeAreaView, Keyboard } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { RectButton, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useAtom } from "jotai";
import { requestsAtom } from "../../store";

export default function Settings() {
  const colors = useColors()
  const style = useStyle()

  const { apiKey, setApiKey } = useApiContext()
  const [apiKeyInput, setApiKeyInput] = useState<string>("")

  const [requests] = useAtom(requestsAtom)

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

            <View style={{ marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
                  Usage
                </Text>
                <Text style={{ color: colors.text, opacity: .75 }}>
                  {requests.length} / 600
                </Text>
              </View>

              <View style={{ position: 'relative', height: 20, backgroundColor: '#eee', marginTop: 10, borderRadius: 10, overflow: 'hidden' }}>
                <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${requests.length / 600 * 100}%`, backgroundColor: colors.primary, opacity: .75 }} />
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