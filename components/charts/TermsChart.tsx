"use client"
import { useState, useEffect } from "react"
import { fetchTerms } from "@/lib/api"
import { FilterProps, Term } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function TermsChart({ brand, channel, period }: FilterProps) {
  const [terms,   setTerms]   = useState<Term[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchTerms({ brand, channel, period, limit: 20 })
      .then(setTerms)
      .finally(() => setLoading(false))
  }, [brand, channel, period])

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-zinc-100 text-[15px]">Best performing terms</CardTitle>
        <CardDescription className="text-zinc-500 text-[13px]">Terms correlated with high-engagement posts</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full bg-zinc-800 rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {terms.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-[13px] text-zinc-300 w-28 truncate">{t.term}</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${t.score * 100}%`, background: `hsl(${Math.round(t.score * 20)}, 75%, ${Math.round(40 + t.score * 20)}%)` }}
                  />
                </div>
                <span className="text-[12px] text-zinc-500 w-8 text-right">{Math.round(t.score * 100)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
