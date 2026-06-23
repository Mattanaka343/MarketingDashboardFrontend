"use client"
import { useEffect, useState } from "react"
import {
  fetchFormats,
  fetchStratPillars,
  fetchContPillars,
  fetchPendingPosts,
  fetchUnpendingPosts,
  fetchMetrics,
  postFormat,
  postStratPillar,
  updatePosts,
} from "@/lib/api"
import { PendingPost, UnpendingPost, FilterProps } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export default function OperationsSection({ brand, channel, period }: FilterProps) {
  const [formats, setFormats] = useState<string[]>([])
  const [stratPillars, setStratPillars] = useState<string[]>([])
  const [contPillars, setContPillars] = useState<string[]>([])

  const [pending, setPending] = useState<PendingPost[]>([])
  const [unpending, setUnpending] = useState<UnpendingPost[]>([])
  const [metrics, setMetrics] = useState<any[]>([])
  const [newFormat, setNewFormat] = useState("")
  const [newStrategy, setNewStrategy] = useState("")
  const [pendingOpen, setPendingOpen] = useState<Record<string, boolean>>({})
  const [unpendingOpen, setUnpendingOpen] = useState<Record<string, boolean>>({})
  const [pendingSelection, setPendingSelection] = useState<Record<string, { format?: string; strat?: string; content?: string }>>({})
  const [unpendingSelection, setUnpendingSelection] = useState<Record<string, { format?: string; strat?: string; content?: string }>>({})
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Record<string,boolean>>({})

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchFormats({ brand, channel, period }),
      fetchStratPillars({ brand, channel, period }),
      fetchContPillars({ brand, channel, period }),
      fetchPendingPosts({ brand, channel, period }),
      fetchUnpendingPosts({ brand, channel, period }),
      fetchMetrics({ brand, channel, period }),
    ])
      .then(([f, s, c, p, u, m]) => {
        setFormats((f as any[]).map((x) => (x.format ? x.format : String(x))))
        setStratPillars((s as any[]).map((x) => (x.pillar ? x.pillar : String(x))))
        setContPillars((c as any[]).map((x) => (x.pillar ? x.pillar : String(x))))
        setPending(p as PendingPost[])
        setUnpending(u as UnpendingPost[])
        setMetrics(m as any[])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [brand, channel, period])

  async function handleAddFormat() {
    if (!newFormat.trim()) return
    try {
      await postFormat({ format: newFormat.trim() })
      const f = await fetchFormats({ brand, channel, period })
      setFormats((f as any[]).map((x) => (x.format ? x.format : String(x))))
      setNewFormat("")
    } catch (e) {
      console.error(e)
    }
  }

  function togglePendingOpen(postId: string) {
    setPendingOpen((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  function toggleUnpendingOpen(postId: string) {
    setUnpendingOpen((prev) => ({ ...prev, [postId]: !prev[postId] }))
  }

  function updatePendingSelection(postId: string, values: { format?: string; strat?: string; content?: string }) {
    setPendingSelection((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        ...values,
      },
    }))
  }

  function updateUnpendingSelection(postId: string, values: { format?: string; strat?: string; content?: string }) {
    setUnpendingSelection((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        ...values,
      },
    }))
  }

  async function handleAddStrategyPillar() {
    if (!newStrategy.trim()) return
    try {
      await postStratPillar({ pillar: newStrategy.trim(), brand })
      const s = await fetchStratPillars({ brand, channel, period })
      setStratPillars((s as any[]).map((x) => (x.pillar ? x.pillar : String(x))))
      setNewStrategy("")
    } catch (e) {
      console.error(e)
    }
  }

  async function handleUpdate(postId: string, values: { format?: string; strat?: string; content?: string }) {
    setUpdating((s) => ({ ...s, [postId]: true }))
    try {
      await updatePosts({
        post_id: postId,
        format: values.format ?? "",
        strat_pillar: values.strat ?? "",
        content_pillar: values.content ?? "",
      })

      setUnpending((rows) =>
        rows.map((r) =>
          r.id === postId
            ? ({
                ...r,
                format: values.format ?? (r as any).format,
                content_pillar: values.content ?? (r as any).content_pillar,
                stratregy_pillar: values.strat ?? (r as any).stratregy_pillar,
              } as UnpendingPost)
            : r
        )
      )
    } catch (e) {
      console.error(e)
    } finally {
      setUpdating((s) => ({ ...s, [postId]: false }))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Operations</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-4">Manage formats and pillars, and assign them to posts.</p>

          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Formats</p>
                <div className="rounded-2xl border border-border p-2 bg-input/30 text-sm">
                  <div className="mt-3 flex gap-2">
                    <input value={newFormat} onChange={(e) => setNewFormat(e.target.value)} className="flex-1 rounded-lg border border-border px-3 py-2 bg-input text-sm" placeholder="New format" />
                    <button onClick={handleAddFormat} className="rounded-lg bg-primary px-3 py-2 text-sm text-white">Add</button>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Strategy pillars</p>
                <div className="rounded-2xl border border-border p-2 bg-input/30 text-sm">
                  <div className="mt-3 flex gap-2">
                    <input value={newStrategy} onChange={(e) => setNewStrategy(e.target.value)} className="flex-1 rounded-lg border border-border px-3 py-2 bg-input text-sm" placeholder="New strategy" />
                    <button onClick={handleAddStrategyPillar} className="rounded-lg bg-primary px-3 py-2 text-sm text-white">Add</button>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Content pillars</p>
                <div className="rounded-2xl border border-border p-2 bg-input/30 text-sm">
                  <div className="text-sm text-muted-foreground">{contPillars.length} available</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Pending posts</h3>
              <div className="space-y-2">
                {pending.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No pending posts</div>
                ) : (
                  pending.slice(0,10).map((p) => {
                    const selection = pendingSelection[p.id] || {}
                    return (
                      <div key={p.id} className="rounded-xl border border-border p-3 bg-card">
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="text-sm mb-1">{p.text}</div>
                            <div className="text-xs text-muted-foreground">{p.brand} · {p.channel} · {p.date}</div>
                          </div>
                          <button
                            onClick={() => togglePendingOpen(p.id)}
                            className="inline-flex items-center rounded-lg bg-muted px-3 py-2 text-sm text-foreground hover:bg-muted/80"
                          >
                            {pendingOpen[p.id] ? "Hide assign" : "Assign"}
                          </button>
                          {pendingOpen[p.id] && (
                            <div className="space-y-3 rounded-xl border border-border bg-background p-3">
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-muted-foreground">Format</span>
                                  <Select
                                    value={selection.format ?? ""}
                                    onValueChange={(val) => updatePendingSelection(p.id, { format: val })}
                                  >
                                    <SelectTrigger size="sm">
                                      <SelectValue>{selection.format || "Select format"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {formats.map((f) => (
                                        <SelectItem key={f} value={f}>{f}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-muted-foreground">Strategy</span>
                                  <Select
                                    value={selection.strat ?? ""}
                                    onValueChange={(val) => updatePendingSelection(p.id, { strat: val })}
                                  >
                                    <SelectTrigger size="sm">
                                      <SelectValue>{selection.strat || "Select strategy"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {stratPillars.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-muted-foreground">Content</span>
                                  <Select
                                    value={selection.content ?? ""}
                                    onValueChange={(val) => updatePendingSelection(p.id, { content: val })}
                                  >
                                    <SelectTrigger size="sm">
                                      <SelectValue>{selection.content || "Select content"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {contPillars.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleUpdate(p.id, selection)}
                                  className="rounded-lg bg-primary px-3 py-2 text-sm text-white"
                                >
                                  Save assignment
                                </button>
                                <button
                                  onClick={() => togglePendingOpen(p.id)}
                                  className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Unpending posts (assign metadata)</h3>
              <div className="space-y-2">
                {unpending.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No unpending posts</div>
                ) : (
                  unpending.slice(0,10).map((p) => {
                    const selection = unpendingSelection[p.id] || {
                      format: (p as any).format ?? "",
                      strat: (p as any).stratregy_pillar ?? (p as any).strat_pillar ?? "",
                      content: (p as any).content_pillar ?? "",
                    }
                    return (
                      <div key={p.id} className="rounded-xl border border-border p-3 bg-card">
                        <div className="flex flex-col gap-3">
                          <div>
                            <div className="text-sm mb-1">{p.text}</div>
                            <div className="text-xs text-muted-foreground">{p.brand} · {p.channel} · {p.date}</div>
                          </div>
                          <button
                            onClick={() => toggleUnpendingOpen(p.id)}
                            className="inline-flex items-center rounded-lg bg-muted px-3 py-2 text-sm text-foreground hover:bg-muted/80"
                          >
                            {unpendingOpen[p.id] ? "Hide modify" : "Modify"}
                          </button>
                          {unpendingOpen[p.id] && (
                            <div className="space-y-3 rounded-xl border border-border bg-background p-3">
                              <div className="grid gap-3 sm:grid-cols-3">
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-muted-foreground">Format</span>
                                  <Select
                                    value={selection.format ?? ""}
                                    onValueChange={(val) => updateUnpendingSelection(p.id, { format: val })}
                                  >
                                    <SelectTrigger size="sm">
                                      <SelectValue>{selection.format || "Select format"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {formats.map((f) => (
                                        <SelectItem key={f} value={f}>{f}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-muted-foreground">Strategy</span>
                                  <Select
                                    value={selection.strat ?? ""}
                                    onValueChange={(val) => updateUnpendingSelection(p.id, { strat: val })}
                                  >
                                    <SelectTrigger size="sm">
                                      <SelectValue>{selection.strat || "Select strategy"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {stratPillars.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs text-muted-foreground">Content</span>
                                  <Select
                                    value={selection.content ?? ""}
                                    onValueChange={(val) => updateUnpendingSelection(p.id, { content: val })}
                                  >
                                    <SelectTrigger size="sm">
                                      <SelectValue>{selection.content || "Select content"}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {contPillars.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  onClick={() => handleUpdate(p.id, selection)}
                                  className="rounded-lg bg-primary px-3 py-2 text-sm text-white"
                                >
                                  Save changes
                                </button>
                                <button
                                  onClick={() => toggleUnpendingOpen(p.id)}
                                  className="rounded-lg border border-border px-3 py-2 text-sm text-foreground"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Metrics (latest)</h3>
            {metrics.length === 0 ? (
              <div className="text-sm text-muted-foreground">No metrics</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm table-fixed border-collapse">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Brand</th>
                      <th className="pb-2">Channel</th>
                      <th className="pb-2">Impressions</th>
                      <th className="pb-2">Engagements</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.slice(0,10).map((m, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-2">{m.date ?? m.id ?? "-"}</td>
                        <td className="py-2">{m.brand ?? "-"}</td>
                        <td className="py-2">{m.channel ?? "-"}</td>
                        <td className="py-2">{m.impressions ?? "-"}</td>
                        <td className="py-2">{m.engagements ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
