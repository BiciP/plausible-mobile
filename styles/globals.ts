import { StyleSheet } from "react-native";
import { shadowMd, shadowSm } from "./shadows";
import { ColorsPallete } from "./colors";

export const createStyles = ({
  colors,
}: {
  colors: ColorsPallete
}) => {
  return StyleSheet.create(
    {
      page: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.background,
      },

      title: {
        fontSize: 24,
        color: colors.text,
        fontWeight: "bold",
      },

      inputLabel: {
        fontSize: 16,
        color: colors.text,
        fontWeight: "bold",
      },

      input: {
        fontSize: 16,
        color: colors.text,
        backgroundColor: colors.inputBackground,

        paddingVertical: 8,
        paddingHorizontal: 12,

        borderRadius: 6,

        borderWidth: 1,
        borderColor: colors.inputBorder,

        // shadow
        ...shadowSm
      },

      text: {
        color: colors.text,
      },

      primaryButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
      },

      primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
      },

      shadowSm: {
        ...shadowSm
      },

      shadowMd: {
        ...shadowMd,
      },
    }
  )
}

export default createStyles;