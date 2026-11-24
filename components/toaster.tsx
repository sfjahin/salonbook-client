"use client"

import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

/** Toast notifications for every success and error message in the app. */
function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <SonnerToaster
      position="top-right"
      closeButton
      richColors
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{
        classNames: {
          toast: "text-sm",
        },
      }}
    />
  )
}

export { Toaster }
