import { useEffect, useState } from "react"
import { getBrandColors } from "@/lib/brandColors"
import { Brand } from "@/types"

export function useBrandColors(brand: Brand) {
  const [colors, setColors] = useState(() => getBrandColors(brand))

  useEffect(() => {
    setColors(getBrandColors(brand))
  }, [brand])

  return colors
}

export function getBrandColorCSS(brand: Brand): CSSProperties {
  const colors = getBrandColors(brand)
  return {
    "--brand-background-light": colors.backgroundLight,
    "--brand-background-dark": colors.backgroundDark,
    "--brand-highlight": colors.highlight,
    "--brand-primary-graph": colors.primaryGraph,
    "--brand-secondary-graph": colors.secondaryGraph,
  } as any
}
