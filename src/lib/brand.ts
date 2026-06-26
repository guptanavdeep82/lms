export const BRAND_LOGO_SRC = "/kr-logo-main.png";
export const BRAND_LOGO_HEADER_SRC = "/kr-logo-header.png";
export const BRAND_LOGO_ALT = "Kaneesh Reena Logics";

/** Logo blue sampled from kr-logo-header.png */
export const brandColors = {
  white: "#ffffff",
  blue: "#0957D3",
  blueDark: "#0538A1",
  navy: "#0E318D",
} as const;

export const brandCssVars = {
  "--kr-white": brandColors.white,
  "--kr-blue": brandColors.blue,
  "--kr-blue-dark": brandColors.blueDark,
  "--kr-navy": brandColors.navy,
  "--kr-blue-80": "rgba(9, 87, 211, 0.8)",
  "--kr-blue-60": "rgba(9, 87, 211, 0.6)",
  "--kr-blue-40": "rgba(9, 87, 211, 0.4)",
  "--kr-blue-20": "rgba(9, 87, 211, 0.2)",
  "--kr-blue-12": "rgba(9, 87, 211, 0.12)",
  "--kr-blue-08": "rgba(9, 87, 211, 0.08)",
  "--kr-blue-06": "rgba(9, 87, 211, 0.06)",
} as const;
