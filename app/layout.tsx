import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { cn } from "@/lib/utils"

import "./globals.css"

import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontSerif = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

// Shared shell for every route: fonts, theme and base styles.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        fontSerif.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
