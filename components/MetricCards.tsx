import { OverviewMetrics } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0
  return (
    <span className={cn("text-[13px] flex items-center gap-1", up ? "text-emerald-400" : "text-red-400")}>
      {up ? "↑" : "↓"} {Math.abs(value).toFixed(2)}{suffix}
    </span>
  )
}

export function MetricCardsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2].map((i) => (
        <Card key={i} className="bg-card border-border">
          <CardContent className="p-5">
            <Skeleton className="h-3 w-24 mb-3 bg-muted" />
            <Skeleton className="h-9 w-32 mb-2 bg-muted" />
            <Skeleton className="h-3 w-20 bg-muted" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function MetricCards({ data }: { data: OverviewMetrics }) {
  const cards = [
    { label: "Impressions",    value: data.impressions.toLocaleString(),          delta: <Delta value={data.impressions_delta} /> },
    { label: "Engagement rate", value: `${data.engagement_rate.toFixed(2)}%`,     delta: <Delta value={data.engagement_delta} suffix="pp" /> },
    { label: "Followers gained", value: `+${data.followers_gained.toLocaleString()}`, delta: <Delta value={data.followers_pct} /> },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((c) => (
        <Card key={c.label} className="bg-card border-border">
          <CardContent className="p-5">
            <p className="text-[12px] text-muted-foreground uppercase tracking-widest mb-3">{c.label}</p>
            <p className="text-[28px] font-medium text-foreground leading-none mb-2">{c.value}</p>
            <div className="flex items-center gap-2">
              {c.delta}
              <span className="text-[12px] text-muted-foreground/70">vs prev period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
