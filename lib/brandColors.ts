import { Brand } from "@/types"

export interface BrandColors {
  // Light mode
  backgroundLight: string
  // Dark mode
  backgroundDark: string
  // Highlights and buttons (both modes)
  highlight: string
  // Main graphs
  primaryGraph: string
  // Secondary graphs
  secondaryGraph: string
}

export const BRAND_COLORS: Record<Brand, BrandColors> = {
  nvai: {
    backgroundLight: "#C6C8CC",
    backgroundDark: "#000000",
    highlight: "#EA8A7B",
    primaryGraph: "#283272",
    secondaryGraph: "#283272",
  },
  buis: {
    backgroundLight: "#C6C8CC",
    backgroundDark: "#000000",
    highlight: "#F07E2E",
    primaryGraph: "#0653A1",
    secondaryGraph: "#96D4E7",
  },
  tal: {
    backgroundLight: "#C6C8CC",
    backgroundDark: "#000000",
    highlight: "#F7A700",
    primaryGraph: "#00A0C1",
    secondaryGraph: "#96D4E7",
  },
}

export function getBrandColors(brand: Brand): BrandColors {
  return BRAND_COLORS[brand] || BRAND_COLORS.nvai
}
