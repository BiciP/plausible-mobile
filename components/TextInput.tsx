import React, { useEffect } from "react";
import { TextInput as RNTextInput, Text } from "react-native";

import globals from "../styles/globals";
import { useColors, useStyle } from "../hooks/useStyle";

interface TextInputProps {
  value: string
  onChangeText: (value: string) => void
  placeholder?: string
  invalid?: boolean
  errorMessage?: string
  as?: React.ComponentType<any>
}
const TextInput = React.forwardRef<RNTextInput, TextInputProps>(({
  value,
  onChangeText,
  placeholder,
  invalid = false,
  errorMessage,
  as = RNTextInput,
}: TextInputProps,
  ref
) => {
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

  const TextInputComponent = as

  return (
    <>
      <TextInputComponent
        ref={ref}
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
      {
        invalid && errorMessage ?
          <Text style={{ color: colors.danger, opacity: .9, marginTop: 5 }}>{errorMessage}</Text> :
          null
      }
    </>
  );
})

export default TextInput;