"use client"


import { MarketplaceWagmiProvider } from "./authentication/wagmi/wagmiProvider"
import { CurrentCollectionProvider } from "./currentCollection/currentCollectionProvider"
import { UserAuthProvider } from "./userAuth"

export function MarketplaceProviders({ children }: { children: React.ReactNode }) {
  return (
    <MarketplaceWagmiProvider>
      <UserAuthProvider>
        <CurrentCollectionProvider>{children}</CurrentCollectionProvider>
      </UserAuthProvider>
    </MarketplaceWagmiProvider>
  )
}
