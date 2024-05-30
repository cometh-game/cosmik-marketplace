"use client"

import { MarketplaceWagmiProvider } from "@/providers/authentication/authenticationUiSwitch"
import { CurrentCollectionProvider } from "@/providers/currentCollection/currentCollectionProvider"
import { UserAuthProvider } from "@/providers/userAuth"

import { AppContent } from "@/components/AppContent"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <MarketplaceWagmiProvider>
      <UserAuthProvider>
        <CurrentCollectionProvider>
          <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
            <AppContent>{children}</AppContent>
          </div>
        </CurrentCollectionProvider>
      </UserAuthProvider>
    </MarketplaceWagmiProvider>
  )
}
