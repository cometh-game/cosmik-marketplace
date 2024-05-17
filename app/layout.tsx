import "@/styles/globals.css"

import { Metadata } from "next"
import { ReactQueryProvider } from "@/providers/react-query"
import { AppThemeProvider } from "@/providers/theme"

import { siteConfig } from "@/config/site"
import { ChakraFont } from "@/lib/utils/fonts"
import { cn } from "@/lib/utils/utils"
import { Toaster } from "@/components/ui/toast/Toaster"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicons/favicon.ico",
    shortcut: "/favicons/favicon-16x16.png",
    apple: "/favicons/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          ChakraFont.variable,
          `min-h-screen bg-[url('/main-bg.jpg')] bg-cover bg-fixed bg-center bg-no-repeat font-sans antialiased`
        )}
      >
        <ReactQueryProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  )
}