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
  80001: {
    chainId: 80001,
    hexaId: "0x13881",
    name: "Matic(Polygon) Testnet Mumbai",
    chain: "Matic(Polygon)",
    network: "testnet",
    explorer: {
      name: "polygonscan",
      url: "https://mumbai.polygonscan.com/",
      standard: "EIP3091",
      blockUrl: "https://mumbai.polygonscan.com/tx",
    },
    nativeToken: {
      id: "matic-network",
      name: "Matic",
      symbol: "tMATIC",
      decimals: 18,
      thumb: "matic.png",
    },
    wrappedNativeToken: {
      name: "Wrapped Matic",
      symbol: "WtMATIC",
      decimals: 18,
      address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
      thumb: "wmatic.png",
    },
    zeroExExchange: "0xf471d32cb40837bf24529fcf17418fc1a4807626",
    minimumBalanceForGas: parseEther("0.1"),
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
    nativeToken: { name: "Ether", symbol: "ETH", decimals: 18 },
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
      url: "https://muster-anytrust-explorer.alt.technology",
      standard: "EIP3091",
      blockUrl: "https://muster-anytrust-explorer.alt.technology/tx",
    },
    nativeToken: { id: "must", name: "Ether", symbol: "ETH", decimals: 18 },
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
