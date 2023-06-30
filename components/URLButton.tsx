import { Linking, Text } from "react-native";

import { useColors } from "../hooks/useStyle";

interface URLButtonProps {
  url: string
  children: React.ReactNode
}

export default function URLButton({ url, children }: URLButtonProps) {
  const colors = useColors()

  const openURL = async () => {
    await Linking.openURL(url)
  }

  return (
    <Text style={{ color: colors.primary }} onPress={openURL}>{children}</Text>
  )
}