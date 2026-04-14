"use client"
import { useState } from "react"
import { Brand, Channel, Period, Section } from "@/types"
import Sidebar         from "@/components/Sidebar"
import Topbar          from "@/components/Topbar"
import OverviewSection from "@/components/sections/OverviewSection"
import PostsSection    from "@/components/sections/PostsSection"

export default function DashboardPage() {
  const [brand,   setBrand]   = useState<Brand>("nvai")
  const [channel, setChannel] = useState<Channel>("all")
  const [period,  setPeriod]  = useState<Period>("90d")
  const [section, setSection] = useState<Section>("overview")

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar
        brand={brand}     onBrandChange={setBrand}
        channel={channel} onChannelChange={setChannel}
        section={section} onSectionChange={setSection}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          section={section}
          period={period}
          onPeriodChange={setPeriod}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {section === "overview" && (
            <OverviewSection brand={brand} channel={channel} period={period} />
          )}
          {section === "posts" && (
            <PostsSection brand={brand} channel={channel} period={period} />
          )}
        </main>
      </div>
    </div>
  )
}
