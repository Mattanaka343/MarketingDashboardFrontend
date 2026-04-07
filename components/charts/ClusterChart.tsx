"use client"
import { useState, useEffect } from "react"
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { fetchClusters } from "@/lib/api"
import { Brand, Channel, ClusterPoint } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const PALETTE = [
  "#5A0000", // very dark red
  "#8B0000", // dark red
  "#C0392B", // strong red
  "#E74C3C", // bright red
  "#FF6B6B", // soft vibrant red
  "#FFB3B3"  // light pastel red
]

function clusterColor(label: string, allLabels: string[]): string {
  return PALETTE[allLabels.indexOf(label) % PALETTE.length]
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload as ClusterPoint
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 max-w-[240px] text-[13px] shadow-lg">
      <p className="text-red-400 font-medium mb-1">{p.cluster}</p>
      <p className="text-zinc-400 leading-relaxed line-clamp-3">{p.text}</p>
    </div>
  )
}

export default function ClusterChart({ brand, channel }: { brand: Brand; channel: Channel }) {
  const [points,  setPoints]  = useState<ClusterPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchClusters({ brand, channel })
      .then(setPoints)
      .finally(() => setLoading(false))
  }, [brand, channel])

  const clusterLabels = Array.from(new Set(points.map((p) => p.cluster)))
  const grouped = clusterLabels.map((label) => ({
    label,
    color:  clusterColor(label, clusterLabels),
    points: points.filter((p) => p.cluster === label),
  }))

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-zinc-100 text-[15px]">Semantic clusters</CardTitle>
        <CardDescription className="text-zinc-500 text-[13px]">2D projection of post embeddings — hover to preview</CardDescription>
      </CardHeader>
      <CardContent className="px-4">
        <div className="flex flex-wrap gap-3 mb-4">
          {grouped.map((g) => (
            <span key={g.label} className="flex items-center gap-1.5 text-[13px] text-zinc-400">
              <span className="w-2 h-2 rounded-full" style={{ background: g.color }} />
              {g.label}
            </span>
          ))}
        </div>
        {loading ? (
          <Skeleton className="h-[260px] w-full bg-zinc-800 rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <XAxis dataKey="x" tick={{ fill: "#52525b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="y" tick={{ fill: "#52525b", fontSize: 12 }} tickLine={false} axisLine={false} width={32} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "#3f3f46" }} />
              {grouped.map((g) => (
                <Scatter key={g.label} name={g.label} data={g.points} fill={g.color}>
                  {g.points.map((point) => (
                    <Cell key={point.post_id} fill={g.color} fillOpacity={0.8} />
                  ))}
                </Scatter>
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
