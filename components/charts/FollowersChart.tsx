"use client"
import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { fetchFollowers } from "@/lib/api"
import { FilterProps, FollowersRow } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
  followers: { label: "Followers", color: "#7d0b0b" },
} satisfies ChartConfig

export default function FollowersChart({ brand, channel, period }: FilterProps) {
  const [data,    setData]    = useState<FollowersRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchFollowers({ brand, channel, period })
      .then(setData)
      .finally(() => setLoading(false))
  }, [brand, channel, period])

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-zinc-100 text-[15px]">Followers growth</CardTitle>
        <CardDescription className="text-zinc-500 text-[13px]">Net new followers per week</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        {loading ? (
          <Skeleton className="h-[140px] w-full bg-zinc-800 rounded-lg" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[140px] w-full">
            <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="#27272a" />
              <XAxis dataKey="week_start" tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 12 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 13 }} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
              <Bar dataKey="followers" fill="#7d0b0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
