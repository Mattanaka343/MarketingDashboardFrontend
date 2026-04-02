"use client"
import { Period, Section } from "@/types"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const PERIODS: { value: Period; label: string }[] = [
  { value: "7d",  label: "7d"  },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "1y",  label: "1y"  },
]

interface TopbarProps {
  section:        Section
  period:         Period
  onPeriodChange: (p: Period) => void
}

export default function Topbar({ section, period, onPeriodChange }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
      <h1 className="text-[15px] font-medium text-zinc-100 capitalize">{section}</h1>
      <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1">
        {PERIODS.map((p) => (
          <Button
            key={p.value}
            variant="ghost"
            size="sm"
            onClick={() => onPeriodChange(p.value)}
            className={cn(
              "h-7 px-3 text-[12px] rounded-md",
              period === p.value
                ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-700"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {p.label}
          </Button>
        ))}
      </div>
    </header>
  )
}
