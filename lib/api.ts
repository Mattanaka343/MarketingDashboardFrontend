import type { OverviewMetrics, TimeseriesRow, FollowersRow, Post, ClusterPoint, Term, Metric } from "@/types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

type Params = {
  brand:    string
  channel?: string
  period?:  string
  metric?:  Metric
  limit?:   number
}

function buildUrl(path: string, params: Params): string {
  const url = new URL(`${BASE}${path}`)
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined) url.searchParams.set(k, String(v))
  })
  return url.toString()
}

async function get<T>(path: string, params: Params): Promise<T> {
  const res = await fetch(buildUrl(path, params), { cache: "no-store" })
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`)
  return res.json()
}

export const fetchOverview    = (p: Params) => get<OverviewMetrics>  ("/api/overview/",            p)
export const fetchTimeseries  = (p: Params) => get<TimeseriesRow[]>  ("/api/overview/timeseries",  p)
export const fetchFollowers   = (p: Params) => get<FollowersRow[]>   ("/api/overview/followers",   p)
export const fetchTopPosts    = (p: Params) => get<Post[]>           ("/api/posts/top",            p)
export const fetchClusters    = (p: Params) => get<ClusterPoint[]>   ("/api/posts/clusters",       p)
export const fetchTerms       = (p: Params) => get<Term[]>           ("/api/posts/terms",          p)
