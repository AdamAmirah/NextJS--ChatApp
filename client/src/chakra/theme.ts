import { ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
export const theme = extendTheme({
  fonts: {
    body: "system-ui, sans-serif",
    heading: "Georgia, serif",
  },
  colors: {
    brand: {
      50: "#d9dff4",
      100: "#edf0fa",
      200: "#49558c",
    },
    purple: {
      50: "#37394a",
      100: "#171926",
    },

    transparent: "transparent",
    black: "#000",
    white: "whiteAlpha.400",
    gray: {
      50: "#f7fafc",
      900: "#171923",
    },
  },
});
