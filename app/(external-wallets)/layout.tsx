"use client"

import { MarketplaceWagmiProvider } from "@/providers/authentication/authenticationUiSwitch"
import { UserAuthProvider } from "@/providers/userAuth"

import { AppContent } from "@/components/AppContent"

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <MarketplaceWagmiProvider>
      <UserAuthProvider>
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
          <AppContent>{children}</AppContent>
        </div>
      </UserAuthProvider>
    </MarketplaceWagmiProvider>
  )
}
