"use client"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { fetchMessage } from "@/lib/api"
import { FilterProps } from "@/types"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AIReviewCard({ brand, channel, period }: FilterProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMessage({ brand, channel, period })
      .then((m) => setMessage(m?.message ?? null))
      .catch(() => setMessage(null))
      .finally(() => setLoading(false))
  }, [brand, channel, period])

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>AI Review</CardTitle>
        <CardDescription>Automated summary of the selected data</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>
        ) : (
          <div className="prose prose-sm prose-invert text-sm text-muted-foreground whitespace-pre-wrap break-words">
            {message ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
            ) : (
              "No AI review available."
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
