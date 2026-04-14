"use client"
import { useState, useEffect } from "react"
import { fetchOverview } from "@/lib/api"
import { FilterProps, OverviewMetrics } from "@/types"
import MetricCards    from "@/components/MetricCards"
import TimelineChart  from "@/components/charts/TimelineChart"
import FollowersChart from "@/components/charts/FollowersChart"

export default function OverviewSection({ brand, channel, period }: FilterProps) {
  const [overview, setOverview] = useState<OverviewMetrics | null>(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchOverview({ brand, channel, period })
      .then(setOverview)
      .finally(() => setLoading(false))
  }, [brand, channel, period])

  return (
    <div className="flex flex-col gap-4">
      {loading || !overview ? (
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 h-[100px] animate-pulse" />
          ))}
        </div>
      ) : (
        <MetricCards data={overview} />
      )}

      <TimelineChart  brand={brand} channel={channel} period={period} />
      <FollowersChart brand={brand} channel={channel} period={period} />
    </div>
  )
}
