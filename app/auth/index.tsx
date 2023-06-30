import React from "react";
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, Pressable, Image, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import TextInput from "../../components/TextInput";
import { useApiContext } from "../../context/auth";
import globals from "../../styles/globals";
import URLButton from "../../components/URLButton";
import { useColors, useStyle } from "../../hooks/useStyle";

export default function Auth() {
  const style = useStyle()
  const colors = useColors()
  const colorScheme = useColorScheme()
  const router = useRouter()
  const { apiKey, setApiKey } = useApiContext()

  const [apiKeyInput, setApiKeyInput] = React.useState("")
  const [invalid, setInvalid] = React.useState(false)

  const submit = () => {
    if (apiKeyInput.length === 0) {
      setInvalid(true)
      return
    }

    setApiKey(apiKeyInput)
  }

  if (apiKey != null) {
    router.push("/")
    return null
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={style.page}>
            <View style={{
              alignItems: 'center',
              marginTop: 16,
              marginBottom: 64,
            }}>
              {
                colorScheme === 'dark' ?
                  <Image
                    source={require('../../assets/plausible_logo_dark.png')}
                    style={{ height: 40, resizeMode: 'contain' }}
                  />
                  :
                  <Image
                    source={require('../../assets/plausible_logo.png')}
                    style={{ height: 40, resizeMode: 'contain' }}
                  />
              }
            </View>

            <Text style={style.inputLabel}>Enter Your API Key</Text>
            <View style={{ marginTop: 4 }}>
              <TextInput
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                placeholder="Your API Key"
                invalid={invalid}
              />
            </View>
            {/*  */}
            <View style={{ marginTop: 16 }}>
              <Text style={style.text}>
                You can find your API key in your <URLButton url="https://plausible.io/settings#api-keys">Plausible Analytics account settings</URLButton>.
              </Text>
            </View>

            <View style={{ marginTop: 32 }}>
              <Text style={{ ...style.text, marginBottom: 6, opacity: .75 }}>
                Don't have an API key?
              </Text>
              <Text style={{ ...style.text, marginBottom: 6 }}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Step 1: </Text>
                Go to your <URLButton url="https://plausible.io/settings#api-keys">Plausible Analytics account settings</URLButton> and click "New API key".
              </Text>

              <Text style={{ ...style.text, marginBottom: 6 }}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Step 2: </Text>
                Enter a name for your API key and <Text style={{ fontWeight: 'bold' }}>copy the key (you cannot do this later)</Text>.
              </Text>

              <Text style={{ ...style.text, marginBottom: 6 }}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Step 3: </Text>
                Click "Continue", paste the key into the box above and click "Submit".
              </Text>
            </View>

            <Pressable onPress={submit} style={{ marginTop: 'auto' }}>
              {
                ({ pressed }) => (
                  <View style={style.primaryButton}>
                    <Text style={style.primaryButtonText}>Submit</Text>
                  </View>
                )
              }
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </>
  )
}

const styles = StyleSheet.create({

})