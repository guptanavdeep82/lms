export const BRAND_LOGO_SRC = "/kr-logo-main.png";
export const BRAND_LOGO_HEADER_SRC = "/kr-logo-header.png";
export const BRAND_LOGO_ALT = "Kaneesh Reena Logics";

/** Strict 2-color palette: white + logo blue only */
export const brandColors = {
  white: "#ffffff",
  blue: "#7c3aed",
} as const;

export const brandCssVars = {
  "--kr-white": brandColors.white,
  "--kr-blue": brandColors.blue,
  "--kr-blue-80": "rgba(124, 58, 237, 0.8)",
  "--kr-blue-60": "rgba(124, 58, 237, 0.6)",
  "--kr-blue-40": "rgba(124, 58, 237, 0.4)",
  "--kr-blue-20": "rgba(124, 58, 237, 0.2)",
  "--kr-blue-12": "rgba(124, 58, 237, 0.12)",
  "--kr-blue-06": "rgba(124, 58, 237, 0.06)",
} as const;
