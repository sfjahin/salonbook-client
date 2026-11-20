import Image from "next/image"
import Link from "next/link"

import { cn } from "cn"

import logo from "@/app/images/SalonBook.png"
import { navItems } from "@/lib/nav"
import { buttonVariants } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { MobileNav } from "@/components/mobile-nav"

function SiteHeader() {
  return (
    <>
      <div className="page-gutter bg-ink py-1.5 text-center text-[0.7rem] tracking-[0.08em] text-paper">
        Your everyday escape. Book a little time for you.
      </div>
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="page-gutter grid h-16 grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className="justify-self-start">
            <Image
              src={logo}
              alt="SalonBook"
              className="h-7 w-auto dark:invert"
              preload
            />
          </Link>

          <div className="hidden md:block">
            <NavigationMenu aria-label="Main">
              <NavigationMenuList className="gap-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      render={<Link href={item.href} />}
                      className="px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden items-center gap-2 justify-self-end md:flex">
            <Link
              href="/sign-in"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-muted-foreground hover:text-foreground"
              )}
            >
              Sign in
            </Link>
            <Link href="/sign-up" className={cn(buttonVariants(), "h-10 px-5")}>
              Sign up
            </Link>
          </div>

          <div className="justify-self-end md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  )
}

export { SiteHeader }
