"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { cn } from "cn"

import logo from "@/app/images/SalonBook.png"
import { navItems } from "@/lib/nav"
import { signOut, useSession } from "@/lib/auth-client"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function MobileNav() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { data, isPending } = useSession()

  const isAdmin =
    (data?.user as { role?: string | null } | undefined)?.role === "admin"

  async function handleSignOut() {
    await signOut()
    setOpen(false)
    router.push("/")
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-10"
            aria-label="Open menu"
          />
        }
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs">
        <SheetHeader className="border-b">
          <SheetTitle>
            <Image
              src={logo}
              alt="SalonBook"
              className="h-6 w-auto dark:invert"
            />
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <SheetClose
              key={item.href}
              render={
                <Link
                  href={item.href}
                  className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                />
              }
            >
              {item.label}
            </SheetClose>
          ))}
        </nav>
        <SheetFooter>
          {isPending ? (
            <span
              className="h-10 w-full animate-pulse rounded-md bg-muted"
              aria-hidden="true"
            />
          ) : data?.user ? (
            <>
              <SheetClose
                render={
                  <Link
                    href={isAdmin ? "/admin" : "/dashboard"}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 w-full"
                    )}
                  />
                }
              >
                {isAdmin ? "Admin dashboard" : "My dashboard"}
              </SheetClose>
              <Button
                type="button"
                onClick={handleSignOut}
                className="h-10 w-full"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <SheetClose
                render={
                  <Link
                    href="/sign-in"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "h-10 w-full"
                    )}
                  />
                }
              >
                Sign in
              </SheetClose>
              <SheetClose
                render={
                  <Link
                    href="/sign-up"
                    className={cn(buttonVariants(), "h-10 w-full")}
                  />
                }
              >
                Sign up
              </SheetClose>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export { MobileNav }
