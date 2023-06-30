import { Link } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

import { useApiContext } from "../context/auth";

export default function Index() {
  const { apiKey, setApiKey } = useApiContext()

  return (
    <View>
      <Text style={styles.title}>Index</Text>
      <Text>Api Key: {apiKey}</Text>
      <Link href="/siteId" asChild>
        <Pressable>
          {
            ({ pressed }) => (
              <Text style={{ color: pressed ? 'red' : 'blue' }}>Go to Site ID</Text>
            )
          }
        </Pressable>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
  }
})