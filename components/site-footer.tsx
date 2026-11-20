import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"

import logo from "@/app/images/SalonBook.png"

const columns = [
  {
    label: "Visit us",
    lines: ["24 Bloom Street, Brooklyn", "New York, NY 11201"],
  },
  {
    label: "Get in touch",
    lines: ["hello@salonbook.com", "+1 (718) 555-0142"],
  },
  {
    label: "Opening hours",
    lines: ["Mon–Fri 9am–7pm", "Sat 9am–5pm Sun Closed"],
  },
]

const socials = ["Instagram", "Pinterest", "Facebook"]

function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="page-gutter py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-block">
              <Image src={logo} alt="SalonBook" className="h-7 w-auto invert" />
            </Link>
            <p className="mt-4 text-xs text-paper/70">
              Beauty that feels like you.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.label}>
              <h2 className="text-[0.6rem] font-medium tracking-[0.18em] text-paper/50 uppercase">
                {column.label}
              </h2>
              <ul className="mt-3 space-y-1 text-xs leading-relaxed text-paper/85">
                {column.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-3 text-[0.7rem] text-paper/60">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {socials.map((social, index) => (
              <Fragment key={social}>
                {index > 0 && (
                  <span aria-hidden="true" className="text-paper/30">
                    ·
                  </span>
                )}
                <a href="#" className="transition-colors hover:text-paper">
                  {social}
                </a>
              </Fragment>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© 2026 SalonBook</span>
            <a href="#" className="transition-colors hover:text-paper">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-paper">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
