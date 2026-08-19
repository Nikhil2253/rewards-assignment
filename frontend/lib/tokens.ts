export const colors = {
  // Neutrals
  background: "#F4F5F7",
  surface: "#FFFFFF",
  surfaceHover: "#FAFAFB",
  border: "#E4E6EB",
  textPrimary: "#12151B",
  textSecondary: "#5B6270",
  textMuted: "#9299A6",

  // Brand / accent (teal-green)
  primary: "#0E6E55",
  primaryHover: "#0A5643",
  primaryMuted: "#E6F2EE",

  // Rewards / coins accent (gold)
  accent: "#C88719",
  accentMuted: "#FBF1DF",

  // Status
  success: "#1E8E5A",
  successMuted: "#E9F7EF",
  warning: "#8A6D00",
  warningMuted: "#FCF4D9",
  danger: "#C1352B",
  dangerMuted: "#FBEAE8",

  // Inverse (sidebar, dark surfaces used sparingly)
  inkSurface: "#12151B",
  inkSurfaceHover: "rgba(255,255,255,0.07)",
  inkBorder: "rgba(255,255,255,0.08)",
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  full: "9999px",
} as const;

export const typography = {
  fontDisplay: "'Sora', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontMono: "'IBM Plex Mono', ui-monospace, monospace",
  size: {
    xs: "11px",
    sm: "12.5px",
    base: "14px",
    md: "16px",
    lg: "20px",
    xl: "28px",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const shadow = {
  sm: "0 1px 2px rgba(18,21,27,0.06)",
  md: "0 4px 12px rgba(18,21,27,0.08)",
  lg: "0 20px 60px rgba(18,21,27,0.25)",
} as const;