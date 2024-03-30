"use client"

import { AppContent } from "@/components/AppContent"
import { SiteHeader } from "@/components/SiteHeader"
import { MarketplaceProviders } from "@/providers/marketplaceProviders"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <MarketplaceProviders>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <SiteHeader />
        <AppContent>{children}</AppContent>
      </div>
    </MarketplaceProviders>
  )
}
