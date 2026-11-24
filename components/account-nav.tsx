"use client"

import Link from "next/link"

import { SignOutButton } from "@/components/sign-out-button"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/auth-client"

function AccountNav() {
  const { data, isPending } = useSession()

  if (isPending) {
    return (
      <span
        className="h-9 w-28 animate-pulse rounded-md bg-muted"
        aria-hidden="true"
      />
    )
  }

  if (!data?.user) {
    return (
      <>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "h-10 px-4 text-muted-foreground hover:text-foreground"
          )}
        >
          Sign in
        </Link>
        <Link href="/sign-up" className={cn(buttonVariants(), "h-10 px-5")}>
          Sign up
        </Link>
      </>
    )
  }

  const isAdmin =
    (data.user as { role?: string | null }).role === "admin"

  return (
    <>
      <Link
        href={isAdmin ? "/admin" : "/dashboard"}
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "h-10 px-4 text-muted-foreground hover:text-foreground"
        )}
      >
        {isAdmin ? "Admin" : "Dashboard"}
      </Link>
      <SignOutButton className="text-muted-foreground hover:text-foreground" />
    </>
  )
}

export { AccountNav }
