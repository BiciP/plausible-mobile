import { View, Text, Platform } from "react-native";
import Card from "./Card";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColors, useStyle } from "../hooks/useStyle";
import compactNumber from "../utils/compactNumber";
import { BorderlessButton } from "react-native-gesture-handler";
import { Duration } from "luxon";

interface StatCardProps {
  icon: typeof Ionicons.defaultProps.name
  title: string
  value?: number
  previousValue?: number
  active?: boolean
  onSetActive?: () => void

  valueType?: "number" | "duration" | "percent"
  invertChange?: boolean
}

export default function StatCard({
  icon,
  title,
  value,
  previousValue,
  active,
  onSetActive,
  valueType = "number",
  invertChange = false
}: StatCardProps) {
  const colors = useColors()
  const style = useStyle()

  if (value == null) return null

  let change = value / (previousValue || 1) * 100 - 100
  let changeColor = (invertChange ? -1 : 1) * change > 0 ? colors.success : change === 0 ? "gray" : colors.danger

  return (
    <Card
      style={{ flex: 1 }}
      shadow={{}}
      as={BorderlessButton}
      onPress={onSetActive}
    >
      <View style={{ flexDirection: "row", columnGap: 10, alignItems: 'center', padding: 10 }}>
        <View style={{ padding: 8, backgroundColor: active ? colors.primary : colors.iconBackground, borderRadius: 8 }}>
          <Ionicons name={Platform.OS === "ios" ? `ios-${icon}` : icon} size={18} color={active ? '#fff' : colors.text} />
        </View>
        <View>
          <Text style={{ ...style.text, fontSize: 10, fontWeight: "bold", opacity: active ? 1 : .6, color: active ? colors.primary : colors.text }}>
            {title.toUpperCase()}
          </Text>
          <View style={{ flexDirection: "row", alignItems: 'center' }}>
            <Text style={{ ...style.text, fontWeight: "bold", fontSize: 18 }}>
              {
                valueType === "duration" ?
                  Duration.fromMillis(value * 1000).toFormat("mm:ss") :
                  compactNumber(value)
              }
              {valueType === "percent" ? "%" : ""}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", marginLeft: 5 }}>
              <Ionicons
                name={change > 0 ? "arrow-up" : change === 0 ? "remove" : "arrow-down"}
                size={10}
                color={changeColor}
              />
              <Text style={{ ...style.text, fontSize: 14, color: changeColor }}>
                {compactNumber(Math.abs(change), 0)}%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ Card>
  )
}