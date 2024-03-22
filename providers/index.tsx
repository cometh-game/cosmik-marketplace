"use client"

import { ReactQueryProvider } from "./react-query"
import { AuthProvider } from "./auth"
import { Web3OnboardProvider } from "./web3-onboard"
import { MarketplaceWagmiProvider } from "./wagmi"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <Web3OnboardProvider>
          <MarketplaceWagmiProvider>{children}</MarketplaceWagmiProvider>
        </Web3OnboardProvider>
      </AuthProvider>
    </ReactQueryProvider>
  )
}
