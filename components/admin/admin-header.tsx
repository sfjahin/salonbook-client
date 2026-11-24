import Link from "next/link"

import { SignOutButton } from "@/components/sign-out-button"

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
] as const

function AdminHeader({ name, email }: { name: string; email: string }) {
  return (
    <header className="border-b border-white/10 bg-ink text-paper">
      <div className="page-gutter flex min-h-16 flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-tight">SalonBook</span>
          <span className="rounded-full bg-paper/15 px-2 py-0.5 text-[0.6rem] font-medium tracking-[0.14em] uppercase">
            Admin
          </span>
        </Link>

        <nav
          aria-label="Administration"
          className="flex items-center gap-1 text-sm"
        >
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
          >
            View site
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm leading-tight">{name}</p>
            <p className="text-[0.7rem] leading-tight text-paper/60">
              {email}
            </p>
          </div>
          <SignOutButton className="text-paper hover:bg-paper/10 hover:text-paper" />
        </div>
      </div>
    </header>
  )
}

export { AdminHeader }
