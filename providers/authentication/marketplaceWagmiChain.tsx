"use client"

import globalConfig from "@/config/globalConfig"
import {
  arbitrum,
  avalanche,
  bsc,
  celo,
  fantom,
  goerli,
  mainnet,
  optimism,
  polygon,
  polygonMumbai,
  
} from "@wagmi/chains"

export const muster = {
  id: 4078,
  name: 'Muster',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://muster.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'Muster', url: 'https://muster-explorer.alt.technology/' },
  },
  testnet: false
}
export const musterTestnet = {
  id: 2121337,
  name: 'Muster Anytrust Sepolia',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://muster-anytrust.alt.technology'] },
  },
  blockExplorers: {
    default: { name: 'Muster anytrust', url: 'https://muster-anytrust-explorer.alt.technology/' },
  },
  testnet: true
}

const wagmiChains = [
  mainnet,
  goerli,
  optimism,
  bsc,
  polygon,
  fantom,
  arbitrum,
  celo,
  avalanche,
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
