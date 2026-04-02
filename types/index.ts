export type Brand   = "nvai" | "buis" | "tal"
export type Channel = "all" | "lin" | "x"
export type Period  = "7d" | "30d" | "90d" | "1y"
export type Section = "overview" | "posts"
export type Metric  = "impressions" | "engagementRate" | "engagements" | "reactions"

export interface OverviewMetrics {
  impressions:       number
  impressions_delta: number
  engagement_rate:   number
  engagement_delta:  number
  followers_gained:  number
  followers_pct:     number
}

export interface TimeseriesRow {
  date:     string
  linkedin: number
  x:        number
}

export interface FollowersRow {
  week_start: string
  followers:  number
}

export interface Post {
  id:              string
  channel:         "lin" | "x"
  text:            string
  url:             string
  published_at:    string
  impressions:     number
  likes:           number
  comments:        number
  shares:          number
  engagement_rate: number
}

export interface ClusterPoint {
  post_id: string
  text:    string
  x:       number
  y:       number
  cluster: string
}

export interface Term {
  id: string
  term:  string
  score: number
}

// Shared props pattern — every data component receives these three
export interface FilterProps {
  brand:   Brand
  channel: Channel
  period:  Period
}

// Brands that only have LinkedIn (no X data)
export const LINKEDIN_ONLY_BRANDS: Brand[] = ["buis", "tal"]
