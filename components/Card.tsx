import { useColors, useStyle } from "../hooks/useStyle"
import { View, useColorScheme } from "react-native"

interface CardProps {
  as?: React.ElementType
  children?: React.ReactNode | React.ReactNode[] | string
  [key: string]: any
}

export default function Card({ as, children, ...props }: CardProps) {
  const colorScheme = useColorScheme()
  const colors = useColors()
  const style = useStyle()

  const Component = as || View

  return (
    <Component
      {...props}
      style={{
        backgroundColor: colors.secondaryBackground,
        borderRadius: 10,

        ...(
          colorScheme === 'light' ?
            style.shadowMd
            : null
        ),
      }}
    >
      {children}
    </Component>
  )
}