import "@/styles/globals.css"

import { Metadata } from "next"
import { AppProviders } from "@/providers/appProviders"
import { useCosmikAuth } from "@/services/cosmik/authService"

import { siteConfig } from "@/config/site"
import { ChakraFont } from "@/lib/utils/fonts"
import { cn } from "@/lib/utils/utils"
import { Toaster } from "@/components/ui/toast/Toaster"
import { AppContent } from "@/components/AppContent"
import { SiteHeader } from "@/components/SiteHeader"
import { TailwindIndicator } from "@/components/TailwindIndicator"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon-16x16.png",
    apple: "/favicons/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  // const { status, authentificate } = useCosmikAuth()

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          ChakraFont.variable,
          `min-h-screen bg-[url('/main-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat font-sans antialiased`
        )}
      >
        <AppProviders>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <SiteHeader />
            <AppContent>{children}</AppContent>
          </div>

          <TailwindIndicator />
        </AppProviders>
        <Toaster />
      </body>
    </html>
  )
}
