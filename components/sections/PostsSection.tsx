"use client"
import { FilterProps } from "@/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import TopPosts     from "@/components/TopPosts"
import ClusterChart from "@/components/charts/ClusterChart"
import TermsChart   from "@/components/charts/TermsChart"

export default function PostsSection({ brand, channel, period }: FilterProps) {
  return (
    <Tabs defaultValue="top">
      <TabsList className="bg-zinc-900 border border-zinc-800 mb-4">
        <TabsTrigger value="top"      className="text-[12px] data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100">Top posts</TabsTrigger>
        <TabsTrigger value="clusters" className="text-[12px] data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100">Semantic clusters</TabsTrigger>
        <TabsTrigger value="terms"    className="text-[12px] data-[state=active]:bg-zinc-700 data-[state=active]:text-zinc-100">Best terms</TabsTrigger>
      </TabsList>

      <TabsContent value="top">
        <TopPosts brand={brand} channel={channel} period={period} />
      </TabsContent>
      <TabsContent value="clusters">
        <ClusterChart brand={brand} channel={channel} />
      </TabsContent>
      <TabsContent value="terms">
        <TermsChart brand={brand} channel={channel} period={period} />
      </TabsContent>
    </Tabs>
  )
}
