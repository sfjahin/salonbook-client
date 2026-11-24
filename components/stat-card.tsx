import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string
  value: string | number
  icon?: LucideIcon
  hint?: string
  className?: string
}) {
  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-5 text-card-foreground",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </p>
        {Icon ? (
          <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        ) : null}
      </div>

      <p className="mt-4 font-serif text-4xl leading-none">{value}</p>

      {hint ? (
        <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </article>
  )
}

export { StatCard }
