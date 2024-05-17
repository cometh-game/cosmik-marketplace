import { Address, parseEther } from "viem"

export type NetworkConfig = {
  chainId: number
  hexaId: string
  name: string
  chain: string
  network: string
  explorer: {
    name: string
    url: string
    standard: string
    blockUrl?: string
  } | null
  nativeToken: {
    id: string
    name: string
    symbol: string
    decimals: number
    thumb?: string
  }
  wrappedNativeToken: {
    name: string
    symbol: string
    address: Address
    decimals: number
    thumb?: string
  }
  zeroExExchange: Address
  // Don't hesitate to update this value as you see fit
  minimumBalanceForGas: bigint
}

const NETWORKS: Record<number, NetworkConfig> = {
  137: {
    chainId: 137,
    hexaId: "0x89",
    name: "Matic(Polygon) Mainnet",
    chain: "Matic(Polygon)",
    network: "mainnet",
    explorer: {
      name: "polygonscan",
      url: "https://polygonscan.com",
      standard: "EIP3091",
      blockUrl: "https://polygonscan.com/tx",
    },
    nativeToken: { id: "matic-network", name: "Matic", symbol: "MATIC", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Matic",
      symbol: "WMATIC",
      decimals: 18,
      address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("0.1"),
  },
  421614: {
    chainId: 421614,
    hexaId: "0x66eee",
    name: "Arbitrum Sepolia",
    chain: "ETH",
    network: "mainnet",
    explorer: {
      name: "Arbiscan",
      url: "https://sepolia.arbiscan.io/",
      standard: "EIP3091",
      blockUrl: "https://sepolia.arbiscan.io/tx",
    },
    nativeToken: { id: "ETH", name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped Ether",
      symbol: "WETH",
      decimals: 18,
      address: "0x980B62Da83eFf3D4576C647993b0c1D7faf17c73",
    },
    zeroExExchange: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
    minimumBalanceForGas: parseEther("0.01"),
  },
  4078: {
    chainId: 4078,
    hexaId: "0xfee",
    name: "Muster Mainnet",
    chain: "Muster",
    network: "mainnet",
    explorer: {
      name: "Muster",
      url: " https://muster-explorer.alt.technology/",
      standard: "EIP3091",
      blockUrl: "https://muster-explorer.alt.technology/tx",
    },
    nativeToken: { id: "ethereum", name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      address: "0x869Bf8814d77106323745758135b999D34C79a87",
    },
    zeroExExchange: "0x156980A14810259B08D3B8e8412274c479c09832",
    minimumBalanceForGas: parseEther("0.01"),
  },
  2121337: {
    chainId: 2121337,
    hexaId: "0x205E79",
    name: "Muster Testnet",
    chain: "Muster",
    network: "testnet",
    explorer: {
      name: "muster blockscout",
      url: "https://muster-anytrust-explorer-v2.alt.technology",
      standard: "EIP3091",
      blockUrl: "https://muster-anytrust-explorer-v2.alt.technology/tx",
    },
    nativeToken: { id: "ethereum", name: "Ether", symbol: "ETH", decimals: 18 },
    wrappedNativeToken: {
      name: "Wrapped ETH",
      symbol: "WETH",
      decimals: 18,
      address: "0xd9eF5BE1AB8AC56325eDd51f995BBCa0eBE7D9e8",
    },
    zeroExExchange: "0x9a6204dE86443eB0914059b291f667D8953e8aE1",
    minimumBalanceForGas: parseEther("0.01"),
  },
}

export default NETWORKS
