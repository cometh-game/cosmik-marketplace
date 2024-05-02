import { useCallback, useMemo } from "react"
import { useCosmikLogout } from "@/services/cosmik/logoutService"
import {
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
} from "@cometh/connect-sdk"
import { comethConnectConnector } from "@cometh/connect-sdk-viem"
import { isAddress } from "viem"
import { useAccount, useConnect, useDisconnect } from "wagmi"

import { env } from "@/config/env"

import { useUserAuthContext } from "../userAuth"

export const useIsComethConnectWallet = () => {
  const { connector } = useAccount()
  return useMemo(() => connector?.type === "cometh", [connector])
}

function numberToHex(value: number): string {
  return `0x${value.toString(16)}`
}

function getSupportedNetworkId(
  networkId: number
): SupportedNetworks | undefined {
  const networkHex = numberToHex(networkId)
  const networks = Object.values(SupportedNetworks)
  return networks.find((network) => network === networkHex)
}

export const useConnectComethWallet = () => {
  const { connectAsync: connect } = useConnect()
  const { disconnectAsync: walletDisconnect } = useDisconnect()
  const { mutateAsync: cosmikDisconnect } = useCosmikLogout()
  const { getUser, setUser, setUserIsFullyConnected } = useUserAuthContext()
  const account = useAccount()

  const chainId = getSupportedNetworkId(env.NEXT_PUBLIC_NETWORK_ID)

  if (!chainId) {
    throw new Error("Network not supported by Cometh Connect.")
  }

  const connectComethWallet = useCallback(
    async (walletAddress: string) => {
      const connector = comethConnectConnector({
        apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
        walletAddress,
      })

      try {
        if (!isAddress(walletAddress)) {
          throw new Error("Invalid wallet address. Please contact support")
        }
        await connect({ connector })
        if (account.isConnected && account.address !== walletAddress) {
          disconnect()
          throw new Error(
            "Your Cosmik wallet address doesn't match the one stored in your browser. Please contact support."
          )
        }
      } catch (error) {
        console.error("Error connecting wallet", error)
      }
    },
    [connect]
  )

  const initNewSignerRequest = useCallback(async (walletAddress: string) => {
    if (!isAddress(walletAddress)) {
      throw new Error("Invalid wallet address.")
    }
    
    const adaptor = new ConnectAdaptor({
      chainId: chainId,
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
    })
    try {
      const addSignerRequest = await adaptor.initNewSignerRequest(walletAddress)
      return addSignerRequest
    } catch (error) {
      console.error("Error initializing new signer request", error)
    }
  }, [])

  const retrieveWalletAddress = useCallback(async (walletAddress: string) => {
    if (!isAddress(walletAddress)) {
      throw new Error("Invalid wallet address.")
    }
    const adaptor = new ConnectAdaptor({
      chainId: chainId,
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      // baseUrl: env.NEXT_PUBLIC_COMETH_CONNECT_BASE_URL!,
    })
    const wallet = new ComethWallet({
      authAdapter: adaptor,
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      rpcUrl: env.NEXT_PUBLIC_RPC_URL!,
    })
    await wallet.connect(walletAddress)
  }, [chainId])

  const disconnect = useCallback(async () => {
    if (account.isConnected || getUser() !== null) {
      try {
        await walletDisconnect({ connector: account.connector })
        await cosmikDisconnect()
        window.localStorage.removeItem("walletAddress")
        setUser(null)
        setUserIsFullyConnected(false)
      } catch (e) {
        console.error("Error disconnecting wallet", e)
        // displayError((e as Error).message)
      }
    }
  }, [
    account,
    cosmikDisconnect,
    walletDisconnect,
    getUser,
    setUser,
    setUserIsFullyConnected,
  ])

  return {
    connectComethWallet,
    retrieveWalletAddress,
    initNewSignerRequest,
    disconnect,
  }
}
