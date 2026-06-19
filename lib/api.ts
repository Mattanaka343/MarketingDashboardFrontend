import type { OverviewMetrics, TimeSeriesRow, FollowersRow, Post, PostData, AIMessage, Metric, Brand, Channel, Period, ClusterPoint,Term,Format,Pillar, PendingPost,UnpendingPost,MetricRow} from "@/types"

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

type Params = {
    brand:              Brand
    channel?:           Channel
    period?:            Period
    metric?:            Metric
    limit?:             number
    strategy_pillar?:   string
    content_pillar?:    string
    format?:            string
    post_id?:           string
}

function buildUrl(path: string, params: Params): string {
    const url = new URL(`${BASE}${path}`)
    Object.entries(params).forEach(([k,v]) => {
        if (v !== undefined) url.searchParams.set(k, String(v))
    })
    return url.toString()
}

async function get<T>(path: string, params: Params): Promise<T> {
    const res = await fetch(buildUrl(path,params), {cache:"no-store"})
    if (!res.ok) throw new Error(`API error ${res.status} on ${path}`)
    return res.json()
}

async function post<T_Request,T_Response>(path:string,data:T_Request): Promise<T_Response> {
    const url = new URL(`${BASE}${path}`)
    const response = await fetch(url,
        {
        method:'POST',
        headers: {'Content-Type':'application/json',},
        body: JSON.stringify(data) 
        })
    if (!response.ok) throw new Error(`API error ${response.status} on ${path}`)
    const result: T_Response = await response.json()
    return result
} 

export const fetchOverview          = (p: Params) => get<OverviewMetrics>   ("/api/overview/",                      p)
export const fetchTimeseries        = (p: Params) => get<TimeSeriesRow[]>   ("/api/overview/timeseries",            p)
export const fetchFollowers         = (p: Params) => get<FollowersRow[]>    ("/api/overview/followers",             p)
export const fetchMessage           = (p: Params) => get<AIMessage>         ("/api/overview/aireview",              p)
export const fetchTopPosts          = (p: Params) => get<Post[]>            ("/api/posts/top",                      p)
export const fetchClusters          = (p: Params) => get<ClusterPoint[]>    ("/api/posts/clusters",                 p)
export const fetchTerms             = (p: Params) => get<Term[]>            ("/api/posts/terms",                    p)
export const fetchFormats           = (p: Params) => get<Format[]>          ("/api/operations/allformats",          p)
export const fetchStratPillars      = (p: Params) => get<Pillar[]>          ("/api/operations/allstratpillars",     p)
export const fetchContPillars       = (p: Params) => get<Pillar[]>          ("/api/operations/allcontentpillars",   p)
export const fetchPendingPosts      = (p: Params) => get<PendingPost[]>     ("/api/operations/pendingposts",        p) 
export const fetchUnpendingPosts    = (p: Params) => get<UnpendingPost[]>   ("/api/operations/unpendingposts",      p)
export const fetchMetrics           = (p: Params) => get<MetricRow[]>       ("/api/operations/metrics",             p)

export const postFormat             = (data: Format) => post<Format,Response>   ("/api/operations/format",            data)
export const postStratPillar        = (data: Pillar) => post<Pillar,Response>   ("/api/operations/stratpillar",       data)

export const updatePosts            = (data: PostData) => post<PostData,Response>   ("/api/operations/updatependingpost",   data)

