"use client"

import React from "react"
import { MarketplaceProviders } from "@/providers/marketplaceProviders"
// import BugsnagPerformance from "@bugsnag/browser-performance"
import Bugsnag from "@bugsnag/js"
import BugsnagPluginReact from "@bugsnag/plugin-react"

import { env } from "@/config/env"
import { AppContent } from "@/components/AppContent"
import { SiteHeader } from "@/components/SiteHeader"

// Bugsnag.start({
//   apiKey: env.NEXT_PUBLIC_BUGSNAG_API_KEY!,
//   plugins: [new BugsnagPluginReact()],
// })
// BugsnagPerformance.start({ apiKey: env.NEXT_PUBLIC_BUGSNAG_API_KEY! })

// @ts-ignore
// const ErrorBoundary = Bugsnag.getPlugin("react").createErrorBoundary(React)
// Bugsnag.notify(new Error("Test error"))

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    // <ErrorBoundary>
    <MarketplaceProviders>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <SiteHeader />
        <AppContent>{children}</AppContent>
      </div>
    </MarketplaceProviders>
    // </ErrorBoundary>
  )
}
