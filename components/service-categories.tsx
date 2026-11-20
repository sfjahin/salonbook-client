import Link from "next/link"

const categories = [
  { label: "Hair", href: "/services?category=hair" },
  { label: "Skin & facials", href: "/services?category=skin-facials" },
  { label: "Nails", href: "/services?category=nails" },
  { label: "Wellness", href: "/services?category=wellness" },
  { label: "Makeup", href: "/services?category=makeup" },
]

function ServiceCategories() {
  return (
    <section className="page-gutter py-14 lg:py-16">
      <h2 className="font-serif text-2xl tracking-tight text-foreground sm:text-3xl">
        Your ritual, your way.
      </h2>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className="flex h-8 items-center justify-center rounded-md bg-sand px-4 text-xs font-medium text-hero-foreground transition-colors hover:bg-sand/70"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

export { ServiceCategories }
