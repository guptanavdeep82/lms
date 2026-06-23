export const BRAND_LOGO_SRC = "/kr-logics-logo.png";
export const BRAND_LOGO_ALT = "KR Logics";

/** Strict 2-color palette: white + logo blue only */
export const brandColors = {
  white: "#ffffff",
  blue: "#0066ff",
} as const;

export const brandCssVars = {
  "--kr-white": brandColors.white,
  "--kr-blue": brandColors.blue,
  "--kr-blue-80": "rgba(0, 102, 255, 0.8)",
  "--kr-blue-60": "rgba(0, 102, 255, 0.6)",
  "--kr-blue-40": "rgba(0, 102, 255, 0.4)",
  "--kr-blue-20": "rgba(0, 102, 255, 0.2)",
  "--kr-blue-12": "rgba(0, 102, 255, 0.12)",
  "--kr-blue-06": "rgba(0, 102, 255, 0.06)",
} as const;
