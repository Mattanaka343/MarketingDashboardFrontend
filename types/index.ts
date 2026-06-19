export type Brand = "nvai" | "buis" | "tal"
export type Channel = "all" | "lin" | "x" | "insta"
export type Period = "7d" | "30d" | "90d" | "1y"
export type Section = "overview" | "posts" | "operations" | "website"
export type Metric = "impressions" | "engagementRate" | "engagements" | "reactions"

export interface OverviewMetrics {
    impressions: number
    impressions_delta: number
    engagement_rate: number
    engagement_delta: number
    followers_gained: number
    followers_pct: number
}

export interface TimeseriesRow {
    date:       string
    linkedin:   number
    x:          number
    insta:      number
}

export interface FollowersRow {
    week_start:     string
    followers:      number
}

export interface Post {
    id:             string
    channel:        string
    text:           string
    url:            string
    published_at:   string
    impressions:    number
    likes:          number
    comments:       number
    shares:         number
    engagement_rate:number
}

export interface ClusterPoint {
    post_id:         string
    text:       string
    x:          string
    y:          string
    cluster:    string
}

export interface Term {
    id:     string
    term:   string
    score:  number
}

export interface PendingPost {
    id:         string
    text:       string
    url:        string
    date:       string
    brand:      string
    channel:    string
}

export interface UnpendingPost {
    id:                 string
    text:               string
    url:                string
    date:               string
    brand:              string
    channel:            string
    format:             string
    stratregy_pillar:   string
    content_pillar:     string
}

export interface MetricRow {
    id:                 string
    date:               string
    brand:              string
    channel:            string
    clicks:             number
    bookmarks:          number
    replies:            number
    engagements:        number
    engagement_rate:    number
    impressions:        string
}

export interface PostData {
    post_id:             string
    strat_pillar:        string
    content_pillar:      string
    format:              string
}

export interface FilterProps {
    brand: Brand
    channel: Channel
    period: Period
}

export interface AIMessage {
    message: string
}

export interface Format {
    format: string
}

export interface Pillar {
    pillar: string
}

export interface Response{
    ok: boolean
    id: string
}

export const LINKEDIN_ONLY_BRANDS: Brand[] = ['buis','tal']