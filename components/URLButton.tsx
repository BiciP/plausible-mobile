import { Linking, Text } from "react-native";

import { useColors } from "../hooks/useStyle";
import { TouchableOpacity } from "react-native-gesture-handler";

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
    <TouchableOpacity onPress={openURL}>
      <Text style={{ color: colors.primary, alignSelf: 'baseline' }}>{children}</Text>
    </TouchableOpacity>
  )
}