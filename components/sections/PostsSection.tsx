"use client"
import { FilterProps } from "@/types"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import TopPosts     from "@/components/TopPosts"
import ClusterChart from "@/components/charts/ClusterChart"
import TermsChart   from "@/components/charts/TermsChart"
import { useBrandColors } from "@/hooks/use-brand-colors"

export default function PostsSection({ brand, channel, period }: FilterProps) {
  const brandColors = useBrandColors(brand)

  return (
    <Tabs defaultValue="top">
      <TabsList className="bg-card border border-border mb-4">
        <TabsTrigger value="top"      className="text-[12px] data-[state=active]:bg-accent data-[state=active]:text-foreground" style={{ '--trigger-active-color': brandColors.highlight } as any}>Top posts</TabsTrigger>
        <TabsTrigger value="clusters" className="text-[12px] data-[state=active]:bg-accent data-[state=active]:text-foreground" style={{ '--trigger-active-color': brandColors.highlight } as any}>Semantic clusters</TabsTrigger>
        <TabsTrigger value="terms"    className="text-[12px] data-[state=active]:bg-accent data-[state=active]:text-foreground" style={{ '--trigger-active-color': brandColors.highlight } as any}>Best terms</TabsTrigger>
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
