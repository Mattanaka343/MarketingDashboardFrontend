"use client"
import { useState } from "react"
import Image from "next/image"
import { Brand, Channel, Section, LINKEDIN_ONLY_BRANDS } from "@/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, LayoutDashboard, FileText } from "lucide-react"

// ── Brand logos (put these in /public/logos/)
const BRANDS: { value: Brand; label: string; logo: string }[] = [
  { value: "nvai", label: "Nurvai",           logo: "/logos/nurvai.png"          },
  { value: "buis", label: "Wexpand Business", logo: "/logos/wexpand-business.png" },
  { value: "tal",  label: "Wexpand Talent",   logo: "/logos/wexpand-talent.png"   },
]

// ── Channel SVG icons (LinkedIn blue + X white — official shapes)
function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function AllChannelsIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

const CHANNELS: { value: Channel; label: string; icon: React.ReactNode }[] = [
  { value: "all", label: "All channels", icon: <AllChannelsIcon /> },
  { value: "lin", label: "LinkedIn",     icon: <LinkedInIcon />    },
  { value: "x",   label: "X (Twitter)",  icon: <XIcon />           },
]

const SECTIONS: { value: Section; label: string; icon: React.ReactNode }[] = [
  { value: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
  { value: "posts",    label: "Posts",    icon: <FileText size={18} />        },
]

interface SidebarProps {
  brand:           Brand
  onBrandChange:   (b: Brand)   => void
  channel:         Channel
  onChannelChange: (c: Channel) => void
  section:         Section
  onSectionChange: (s: Section) => void
}

export default function Sidebar({
  brand, onBrandChange,
  channel, onChannelChange,
  section, onSectionChange,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const isLinkedInOnly = LINKEDIN_ONLY_BRANDS.includes(brand)

  function handleBrandChange(b: Brand) {
    onBrandChange(b)
    if (LINKEDIN_ONLY_BRANDS.includes(b) && channel === "x") {
      onChannelChange("all")
    }
  }

  const availableChannels = CHANNELS.filter(
    (c) => !(isLinkedInOnly && c.value === "x")
  )

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col bg-zinc-950 border-r border-zinc-800 py-4 transition-all duration-300 ease-in-out relative",
          collapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* ── BRANDS */}
        <div className="px-3 mb-4">
          {!collapsed && (
            <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-2 px-1">Brand</p>
          )}
          <div className="flex flex-col gap-1">
            {BRANDS.map((b) => (
              <Tooltip key={b.value}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleBrandChange(b.value)}
                    className={cn(
                      "flex items-center rounded-lg transition-colors border",
                      collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "gap-3 px-2 py-2 w-full",
                      brand === b.value
                        ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                        : "border-transparent text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300"
                    )}
                  >
                    <div className={cn(
                      "relative flex-shrink-0 rounded-md overflow-hidden bg-black",
                      collapsed ? "w-8 h-8" : "w-8 h-8"
                    )}>
                      <Image
                        src={b.logo}
                        alt={b.label}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    {!collapsed && (
                      <span className="text-[14px] font-medium truncate">{b.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-zinc-800 text-zinc-100 border-zinc-700 text-[13px]">
                    {b.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator className="mx-3 mb-4 bg-zinc-800" style={{ width: "auto" }} />

        {/* ── CHANNELS */}
        <div className="px-3 mb-4">
          {!collapsed && (
            <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-2 px-1">Channel</p>
          )}
          <div className="flex flex-col gap-1">
            {availableChannels.map((c) => (
              <Tooltip key={c.value}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onChannelChange(c.value)}
                    className={cn(
                      "flex items-center rounded-lg transition-colors border",
                      collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "gap-3 px-2 py-2 w-full",
                      channel === c.value
                        ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                        : "border-transparent text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300"
                    )}
                  >
                    <span className={cn("flex-shrink-0", collapsed ? "" : "w-5 flex justify-center")}>
                      {c.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-[14px]">{c.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-zinc-800 text-zinc-100 border-zinc-700 text-[13px]">
                    {c.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </div>

        <Separator className="mx-3 mb-4 bg-zinc-800" style={{ width: "auto" }} />

        {/* ── SECTIONS */}
        <div className="px-3">
          {!collapsed && (
            <p className="text-[11px] text-zinc-600 uppercase tracking-widest mb-2 px-1">Sections</p>
          )}
          <div className="flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <Tooltip key={s.value}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSectionChange(s.value)}
                    className={cn(
                      "flex items-center rounded-lg transition-colors border",
                      collapsed ? "w-10 h-10 justify-center mx-auto p-0" : "gap-3 px-2 py-2 w-full",
                      section === s.value
                        ? "bg-zinc-800 border-zinc-600 text-zinc-100"
                        : "border-transparent text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300"
                    )}
                  >
                    <span className={cn("flex-shrink-0", collapsed ? "" : "w-5 flex justify-center")}>
                      {s.icon}
                    </span>
                    {!collapsed && (
                      <span className="text-[14px]">{s.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right" className="bg-zinc-800 text-zinc-100 border-zinc-700 text-[13px]">
                    {s.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </div>

      </aside>
    </TooltipProvider>
  )
}
