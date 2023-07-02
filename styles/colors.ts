export const lightColorsPallete = {
  background: "#fff",
  secondaryBackground: "#fff", // used for cards, modal, etc -> can be white in light mode as we use shadows to differentiate
  text: "#1f2937",
  primary: "#4f46e5",
  danger: "#dc2626",

  inputBackground: "#fff",
  inputBorder: "#d1d5db",
}

export const darkColorsPallete = {
  background: "#1a202c",
  secondaryBackground: "#252f3f",
  text: "#fff",
  primary: "#6574cd",
  danger: "#dc2626",

  inputBackground: "#111827",
  inputBorder: "#6b7280"
}

export type ColorsPallete = typeof lightColorsPallete
