"use client"

import { MarketplaceWagmiProvider } from "@/providers/authentication/authenticationUiSwitch"

import { CurrentCollectionProvider } from "./currentCollection/currentCollectionProvider"
import { ReactQueryProvider } from "./react-query"
import { AppThemeProvider } from "./theme"
import { UserAuthProvider } from "./userAuth"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <AppThemeProvider>
        <MarketplaceWagmiProvider>
          <UserAuthProvider>
            <CurrentCollectionProvider>{children}</CurrentCollectionProvider>
          </UserAuthProvider>
        </MarketplaceWagmiProvider>
      </AppThemeProvider>
    </ReactQueryProvider>
  )
}
