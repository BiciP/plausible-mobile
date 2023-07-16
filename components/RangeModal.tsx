import { rangeAtom, rangeModal } from "../store/range";
import { BottomSheetModal, BottomSheetView, useBottomSheetDynamicSnapPoints } from "@gorhom/bottom-sheet";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import React, { useEffect, useMemo } from "react";
import { Picker } from '@react-native-picker/picker';
import { BorderlessButton } from "react-native-gesture-handler";
import { View, Text } from "react-native";
import { useStyle } from "../hooks/useStyle";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RangeModal() {
  const style = useStyle()
  const insets = useSafeAreaInsets()

  const setModalRef = useSetAtom(rangeModal);
  const currentRange = useAtomValue(rangeAtom);
  const setCurrentRange = useSetAtom(rangeAtom);
  const [pickerRange, setPickerRange] = React.useState(currentRange);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  const handleApply = React.useCallback(() => {
    setCurrentRange(pickerRange);
    bottomSheetModalRef.current?.dismiss();
  }, [pickerRange]);

  useEffect(() => {
    setModalRef(bottomSheetModalRef);
  }, [bottomSheetModalRef.current]);

  useEffect(() => {
    setPickerRange(currentRange)
  }, [currentRange])

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
    >
      <BottomSheetView
        onLayout={handleContentLayout}
        style={{
          paddingBottom: insets.bottom,
        }}
      >
        <Picker
          selectedValue={pickerRange}
          onValueChange={setPickerRange}
        >
          {/* <Picker.Item label="Today" value="today" /> */}
          <Picker.Item label="Last 7 days" value="7days" />
          <Picker.Item label="Last 30 days" value="30days" />
          {/* <Picker.Item label="Month to date" value="monthtodate" /> */}
          <Picker.Item label="Last month" value="lastmonth" />
          {/* <Picker.Item label="Year to date" value="yeartodate" /> */}
          <Picker.Item label="Last 12 months" value="last12months" />
          {/* <Picker.Item label="All time" value="alltime" /> */}
        </Picker>

        <View style={{ padding: 10 }}>
          <BorderlessButton onPress={handleApply}>
            <View style={{ ...style.primaryButton, }}>
              <Text style={{ ...style.primaryButtonText }}>
                Apply
              </Text>
            </View>
          </BorderlessButton>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  )
}