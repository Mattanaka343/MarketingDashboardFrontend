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
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  function loadReview() {
    setLoading(true)
    fetchMessage({ brand, channel, period })
      .then((m) => setMessage(m?.message ?? null))
      .catch(() => setMessage(null))
      .finally(() => {
        setLoading(false)
        setLoaded(true)
      })
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>AI Review</CardTitle>
        <CardDescription>Automated summary of the selected data</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        {!loaded ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">Press the button to load the AI review.</p>
            <button
              onClick={loadReview}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Loading review..." : "Load AI review"}
            </button>
          </div>
        ) : loading ? (
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
