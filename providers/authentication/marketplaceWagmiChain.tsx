"use client"

import globalConfig from "@/config/globalConfig"
import {
  arbitrum,
  polygon,
  polygonMumbai,
} from "@wagmi/chains"

const muster = {
  id: 4078,
  name: 'Muster',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://muster.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'Muster', url: 'https://muster-explorer.alt.technology' },
  },
  testnet: false
}
const musterTestnet = {
  id: 2121337,
  name: 'Muster Anytrust Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://muster-anytrust.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'Muster anytrust', url: 'https://muster-anytrust-explorer-v2.alt.technology' },
  },
  testnet: true
}

const wagmiChains = [
  polygon,
  arbitrum,
  polygonMumbai,
  musterTestnet,
  muster
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
