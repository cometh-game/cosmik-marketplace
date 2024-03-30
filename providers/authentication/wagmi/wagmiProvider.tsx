"use client"

import { manifest } from "@/manifests/manifests"
import { Chain } from "@wagmi/chains"
import { createConfig, http, WagmiProvider } from "wagmi"

import { marketplaceChain } from "../marketplaceWagmiChain"

export const wagmiConfig = createConfig({
  chains: [marketplaceChain] as [Chain, ...Chain[]],
  transports: {
    [marketplaceChain.id]: http(manifest.rpcUrl),
  },
  ssr: true,
})

export function MarketplaceWagmiProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
