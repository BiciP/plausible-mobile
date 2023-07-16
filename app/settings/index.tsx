import { useApiContext } from "../../context/auth";
import TextInput from "../../components/TextInput";
import { useColors, useStyle } from "../../hooks/useStyle";
import { Stack } from "expo-router";
import { View, Text, SafeAreaView, Keyboard, Linking } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BorderlessButton, RectButton, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useAtom, useAtomValue } from "jotai";
import { requestsAtom } from "../../store";
import URLButton from "../../components/URLButton";
import { instanceAtom } from "../../store/instance";

export default function Settings() {
  const colors = useColors()
  const style = useStyle()
  const [instance, setInstance] = useAtom(instanceAtom)

  const { apiKey, baseUrl, setApiKey } = useApiContext()
  const [apiKeyInput, setApiKeyInput] = useState<string>("")
  const [instanceUrl, setInstanceUrl] = useState<string>(baseUrl)

  const [requests] = useAtom(requestsAtom)

  const handleSave = useCallback(() => {
    setApiKey(apiKeyInput)
    setInstance(instanceUrl)
  }, [apiKeyInput, instanceUrl])

  const resetInstanceURL = () => {
    let defaultUrl = "https://plausible.io"
    setInstanceUrl(defaultUrl)
    setInstance(defaultUrl)
  }

  const saveEnabled = useMemo(() => {
    return apiKey !== apiKeyInput ||
      instance !== instanceUrl
  }, [
    apiKey, apiKeyInput,
    instance, instanceUrl
  ])

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
            <View style={{ rowGap: 15 }}>
              <View>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
                  API Key
                </Text>
                <TextInput
                  value={apiKeyInput}
                  onChangeText={setApiKeyInput}
                />
              </View>

              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold' }}>
                    Instance URL
                  </Text>
                  <BorderlessButton onPress={resetInstanceURL}>
                    <Text style={{ color: colors.primary }}>
                      Reset
                    </Text>
                  </BorderlessButton>
                </View>
                <TextInput
                  value={instanceUrl}
                  onChangeText={setInstanceUrl}
                />
              </View>

              <View>
                <RectButton
                  onPress={handleSave}
                  style={{
                    ...style.primaryButton,
                    opacity: saveEnabled ? 1 : .5
                  }}
                  enabled={saveEnabled}
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

              <Text style={{ color: colors.text, opacity: .75, marginTop: 5, textAlign: 'justify' }}>
                This limit is set by Plausible Analytics. We try to track your usage to keep you informed, but it may not be 100% accurate. If you hit the limit, the app might not work for about an hour.
              </Text>
            </View>

            <BorderlessButton
              style={{
                backgroundColor: "#FD0",
                padding: 15,
                borderRadius: 12,
                alignItems: 'center',
                width: '75%',
                alignSelf: 'center',
                marginTop: 'auto',
              }}
              onPress={async () => {
                await Linking.openURL("https://www.buymeacoffee.com/andrazPolajzer")
              }}
            >
              <Text style={{
                color: "#000",
                fontSize: 18,
              }}>
                ☕ Buy Me a Coffee
              </Text>
            </BorderlessButton>

            <View style={{
              opacity: .5,
              marginTop: 20,
              alignItems: 'center',
            }}>
              <Text style={{ color: colors.text }}>
                Staat • {require('../../package.json').version}
              </Text>
              <URLButton url="https://github.com/BiciP/plausible-mobile">View on GitHub</URLButton>
              <Text style={{ color: colors.text, marginTop: 10 }}>
                Not affiliated with Plausible Analytics
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </>
  )
}