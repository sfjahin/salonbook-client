import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import heroImage from "@/app/images/Sunlit salon.png"
import logo from "@/app/images/SalonBook.png"

function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="flex flex-1 flex-col bg-auth text-hero-foreground lg:grid lg:grid-cols-2">
      <aside className="relative hidden lg:block">
        <Image
          src={heroImage}
          alt="Sunlit salon interior with arched windows, warm plaster walls and cognac styling chairs"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-10 bottom-10 rounded-lg bg-hero/95 px-9 py-8 xl:inset-x-12 xl:bottom-12 xl:px-10 xl:py-9">
          <p className="font-serif text-4xl leading-[1.18] tracking-tight text-ink">
            A little time.
            <br />A beautiful beginning.
          </p>
          <p className="mt-4 text-sm text-hero-muted">
            Your next feel-good moment is waiting.
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:px-12 lg:py-10 xl:px-20">
        <div className="mx-auto flex w-full max-w-[26.25rem] flex-1 flex-col">
          <Link href="/" className="w-fit">
            <Image src={logo} alt="SalonBook" className="h-8 w-auto" priority />
          </Link>

          <Link
            href="/"
            className="mt-8 flex w-fit items-center gap-1.5 text-xs text-hero-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to home
          </Link>

          <div className="mt-12">
            <h1 className="font-serif text-[2.25rem] leading-[1.15] tracking-tight sm:text-[2.5rem] xl:text-[2.75rem]">
              {title}
            </h1>
            <p className="mt-4 text-sm text-hero-muted">{subtitle}</p>
          </div>

          <div className="mt-8 flex flex-1 flex-col">
            {children}

            <footer className="mt-auto pt-14 text-[0.7rem] text-hero-muted">
              <span>© 2026 SalonBook</span>
              <span aria-hidden="true" className="px-2">
                ·
              </span>
              <a href="#" className="transition-colors hover:text-foreground">
                Privacy
              </a>
              <span aria-hidden="true" className="px-2">
                ·
              </span>
              <a href="#" className="transition-colors hover:text-foreground">
                Terms
              </a>
            </footer>
          </div>
        </div>
      </div>
    </main>
  )
}

export { AuthShell }
