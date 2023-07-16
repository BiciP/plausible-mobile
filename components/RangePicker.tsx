import Ionicons from "@expo/vector-icons/Ionicons";
import { View, Text } from "react-native";
import { BorderlessButton } from "react-native-gesture-handler";
import { useColors } from "../hooks/useStyle";
import { useAtomValue } from "jotai";
import { useCallback, useEffect } from "react";
import { rangeAtom, rangeModal } from "../store/range";
import { rangeEnum } from "../utils/rangeHelper";

export default function RangePicker() {
  const rangeModalRef = useAtomValue(rangeModal)
  const currentRange = useAtomValue(rangeAtom)

  const colors = useColors()

  const handleRangePress = useCallback(() => {
    if (!rangeModalRef?.current) return
    rangeModalRef.current.present()
  }, [rangeModalRef])

  return (
    <BorderlessButton onPress={handleRangePress}>
      <View style={{
        backgroundColor: colors.iconBackground,
        paddingVertical: 4,
        paddingHorizontal: 8,
        paddingLeft: 12,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 4,
      }}>
        <Text style={{
          fontSize: 12,
          color: colors.text,
        }}>
          {rangeEnum[currentRange]}
        </Text>
        <Ionicons name="chevron-down" size={12} color={colors.text} />
      </View>
    </BorderlessButton>
  )
}