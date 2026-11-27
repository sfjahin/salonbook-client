import Link from "next/link"

import { fetchCategories } from "@/lib/catalog"

/** Preferred order for the category pills; unknown categories follow. */
const CATEGORY_ORDER = ["Hair", "Skin", "Nails", "Wellness", "Beauty"]

function sortCategories<T extends { value: string }>(categories: T[]) {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.value)
    const bi = CATEGORY_ORDER.indexOf(b.value)

    if (ai === -1 && bi === -1) return a.value.localeCompare(b.value)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

/**
 * Dynamic home section: the real service categories stored in MongoDB.
 */
async function ServiceCategories() {
  const categories = sortCategories(await fetchCategories())

  if (categories.length === 0) return null

  return (
    <section className="page-gutter py-14 lg:py-16">
      <p className="text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Browse by ritual
      </p>
      <h2 className="mt-4 font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
        Your ritual, your way.
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex">
        {categories.map((category) => (
          <Link
            key={category.value}
            href={`/services?category=${encodeURIComponent(category.value)}`}
            className="flex h-10 items-center justify-center rounded-full bg-sand px-4 text-center text-xs font-medium text-hero-foreground transition-colors hover:bg-sand/70 lg:flex-1"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

export { ServiceCategories }
