"use client";

import { createTheme } from "@mui/material/styles";

/**
 * MUI is used for behaviour (dialogs, drawers, tooltips, snackbars) and
 * accessibility, never for its default look. Everything visual is pulled back
 * to the SHOWTIME palette so nothing reads as stock Material.
 */
export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "dark",
    background: { default: "#050505", paper: "#0b0607" },
    primary: { main: "#a3161c", light: "#c8272e", dark: "#6e0e12", contrastText: "#f4e7c5" },
    secondary: { main: "#d6a84a", light: "#ffd76a", dark: "#9d7526", contrastText: "#12090a" },
    text: { primary: "#f4e7c5", secondary: "rgba(244,231,197,0.62)" },
    divider: "rgba(214,168,74,0.22)",
    error: { main: "#c8272e" },
    warning: { main: "#d6a84a" },
    success: { main: "#8fae63" },
  },
  shape: { borderRadius: 2 },
  typography: {
    fontFamily: "var(--font-ui), Inter, system-ui, sans-serif",
    button: {
      textTransform: "uppercase",
      letterSpacing: "0.16em",
      fontWeight: 600,
      fontSize: "0.8rem",
    },
    h1: { fontFamily: "var(--font-display), Cinzel, Georgia, serif" },
    h2: { fontFamily: "var(--font-display), Cinzel, Georgia, serif" },
    h3: { fontFamily: "var(--font-display), Cinzel, Georgia, serif" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#050505" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#12090a",
          border: "1px solid rgba(214,168,74,0.35)",
          color: "#f4e7c5",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          borderRadius: 2,
        },
        arrow: { color: "#12090a" },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0b0607",
          backgroundImage:
            "linear-gradient(180deg, rgba(110,14,18,0.35), rgba(5,5,5,0.98))",
          borderLeft: "1px solid rgba(214,168,74,0.28)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0b0607",
          backgroundImage: "none",
          border: "1px solid rgba(214,168,74,0.3)",
          borderRadius: 2,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: { disableRipple: false },
    },
  },
});

export default theme;
