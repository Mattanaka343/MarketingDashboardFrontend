"use client"
import { useState, useEffect } from "react"
import { fetchTopPosts } from "@/lib/api"
import { FilterProps, Post } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function PostSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <Skeleton className="h-3 w-16 mb-3 bg-muted" />
        <Skeleton className="h-3 w-full mb-2 bg-muted" />
        <Skeleton className="h-3 w-3/4 mb-4 bg-muted" />
        <div className="flex gap-4 pt-2 border-t border-border">
          <Skeleton className="h-6 w-16 bg-muted" />
          <Skeleton className="h-6 w-16 bg-muted" />
          <Skeleton className="h-6 w-16 bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[14px] font-medium text-foreground">{value}</span>
      <span className="text-[11px] text-muted-foreground/70">{label}</span>
    </div>
  )
}

export default function TopPosts({ brand, channel, period }: FilterProps) {
  const [posts,   setPosts]   = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchTopPosts({ brand, channel, period, limit: 6 })
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [brand, channel, period])

  if (loading) return (
    <div className="grid grid-cols-3 gap-3">
      {[0, 1, 2, 3, 4, 5].map((i) => <PostSkeleton key={i} />)}
    </div>
  )

  return (
    <div className="grid grid-cols-3 gap-3">
      {posts.map((post) => (
        <a
          key={post.id}
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <Card className="bg-card border-border h-full group-hover:border-border transition-colors">
            <CardContent className="p-4 flex flex-col gap-3 h-full">
              <Badge
                variant="outline"
                className={cn(
                  "w-fit text-[10px] border",
                  post.channel === "lin"
                    ? "border-[#0a66c2]/40 text-[#4d9fd6] bg-[#0a66c2]/10"
                    : "border-border text-muted-foreground bg-muted"
                )}
              >
                {post.channel === "lin" ? "LinkedIn" : "X"}
              </Badge>
              <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                {post.text}
              </p>
              <div className="flex gap-4 pt-2 border-t border-border mt-auto">
                <Stat label="Impressions" value={post.impressions.toLocaleString()} />
                <Stat label="Likes"       value={post.likes.toLocaleString()} />
                <Stat label="Eng."        value={`${post.engagement_rate.toFixed(1)}%`} />
              </div>
            </CardContent>
          </Card>
        </a>
      ))}
    </div>
  )
}
