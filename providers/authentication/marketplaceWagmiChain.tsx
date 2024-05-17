"use client"

import { manifest } from "@/manifests/manifests"
import { arbitrum, polygon, polygonMumbai } from "@wagmi/chains"

import globalConfig from "@/config/globalConfig"
import NETWORKS from "@/config/networks"

const muster = {
  id: 4078,
  name: "Muster",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://muster.alt.technology"] },
  },
  blockExplorers: {
    default: { name: "Muster", url: "https://muster-explorer.alt.technology" },
  },
  testnet: false,
}
const musterTestnet = {
  id: 2121337,
  name: "Muster Anytrust Sepolia",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://muster-anytrust.alt.technology"] },
  },
  blockExplorers: {
    default: {
      name: "Muster anytrust",
      url: "https://muster-anytrust-explorer-v2.alt.technology",
    },
  },
  testnet: true,
}
const arbitrumSepolia = {
  id: 421614,
  name: `${NETWORKS[421614].name}`,
  nativeCurrency: {
    name: `${NETWORKS[421614].nativeToken.name}`,
    symbol: `${NETWORKS[421614].nativeToken.symbol}`,
    decimals: `${NETWORKS[421614].nativeToken.decimals}`,
  },
  rpcUrls: {
    default: { http: [`${manifest.rpcUrl}`] },
  },
  blockExplorers: {
    default: {
      name: `${NETWORKS[421614].explorer?.name}`,
      url: `${NETWORKS[421614].explorer?.url}`,
    },
  },
  testnet: true,
}

const wagmiChains = [
  polygon,
  arbitrum,
  polygonMumbai,
  arbitrumSepolia,
  musterTestnet,
  muster,
]
let matchingChain = wagmiChains.find(
  (chain) => chain.id === globalConfig.network.chainId
)

if (!matchingChain) {
  throw new Error(
    `Wagmi chain found for network ${globalConfig.network.chainId}. Check if it can be imported or add it manually`
  )
}

export const marketplaceChain = matchingChain
