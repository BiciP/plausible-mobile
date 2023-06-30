import React, { useEffect } from "react";
import { TextInput as RNTextInput } from "react-native";

import globals from "../styles/globals";
import { useColors, useStyle } from "../hooks/useStyle";

interface TextInputProps {
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
  invalid?: boolean
}

export default function TextInput({
  value,
  onChangeText,
  placeholder,
  invalid = false,
}: TextInputProps) {
  const style = useStyle()
  const colors = useColors()
  const defaultBorder = style.input.borderColor

  const [borderColor, setBorderColor] = React.useState(defaultBorder)
  const [focus, setFocus] = React.useState(false)

  useEffect(() => {
    if (invalid) {
      setBorderColor(colors.danger)
    } else if (focus) {
      setBorderColor(colors.primary)
    } else {
      setBorderColor(defaultBorder)
    }
  }, [invalid, focus])

  return (
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}

      style={{
        ...style.input,
        borderColor,
      }}

      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}