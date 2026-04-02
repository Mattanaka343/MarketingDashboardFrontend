"use client"
import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { fetchTimeseries } from "@/lib/api"
import { FilterProps, TimeseriesRow, Metric, LINKEDIN_ONLY_BRANDS } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const METRICS: { value: Metric; label: string }[] = [
  { value: "impressions",    label: "Impressions"     },
  { value: "engagementRate", label: "Engagement rate" },
  { value: "engagements",    label: "Engagements"     },
  { value: "reactions",      label: "Reactions"       },
]

const chartConfig = {
  linkedin: { label: "LinkedIn", color: "#e05252" },
  x:        { label: "X",        color: "#f0a0a0" },
} satisfies ChartConfig

export default function TimelineChart({ brand, channel, period }: FilterProps) {
  const [data,    setData]    = React.useState<TimeseriesRow[]>([])
  const [metric,  setMetric]  = React.useState<Metric>("impressions")
  const [loading, setLoading] = React.useState(true)

  const showX = !LINKEDIN_ONLY_BRANDS.includes(brand) && channel !== "lin"

  React.useEffect(() => {
    setLoading(true)
    fetchTimeseries({ brand, channel, period, metric })
      .then(setData)
      .finally(() => setLoading(false))
  }, [brand, channel, period, metric])

  const metricLabel = METRICS.find((m) => m.value === metric)?.label ?? "Impressions"

  return (
    <Card className="bg-zinc-900 border-zinc-800 pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-zinc-800 py-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-zinc-100 text-[15px]">Performance over time</CardTitle>
          <CardDescription className="text-zinc-500 text-[13px]">
            {metricLabel} — last {period}
          </CardDescription>
        </div>
        <Select value={metric} onValueChange={(v) => setMetric(v as Metric)}>
          <SelectTrigger className="w-[170px] rounded-lg bg-zinc-800 border-zinc-700 text-zinc-300 text-[13px]">
            <SelectValue placeholder="Impressions" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-zinc-900 border-zinc-700">
            {METRICS.map((m) => (
              <SelectItem key={m.value} value={m.value} className="text-zinc-300 text-[13px] rounded-lg">
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <Skeleton className="h-[250px] w-full bg-zinc-800 rounded-lg" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="fillLinkedin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#e05252" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e05252" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="fillX" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f0a0a0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f0a0a0" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#27272a" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "#71717a", fontSize: 13 }}
                tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#71717a", fontSize: 13 }} width={44} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    indicator="dot"
                  />
                }
              />
              <Area dataKey="linkedin" type="natural" fill="url(#fillLinkedin)" stroke="#e05252" strokeWidth={2} />
              {showX && (
                <Area dataKey="x" type="natural" fill="url(#fillX)" stroke="#f0a0a0" strokeWidth={2} />
              )}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
