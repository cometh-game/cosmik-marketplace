import { useCallback, useMemo } from "react"
import { manifest } from "@/manifests/manifests"
import { useCosmikLogout } from "@/services/cosmik/logoutService"
import Bugsnag from "@bugsnag/js"
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

export const useComethConnectConnector = (userWalletAddress?: string) => {
  return useMemo(() => {
    if (!env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY || typeof window === 'undefined') {
      return undefined
    }
    return comethConnectConnector({
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY,
      rpcUrl: manifest.rpcUrl,
      walletAddress: userWalletAddress,
    })
  }, [userWalletAddress])
}

export const useComethConnectLogin = (
  userWalletAddress?: string,
  onConnectError?: (error: Error) => void
) => {
  const handleConnectError = useCallback(
    (error: Error) => {
      console.error("Error connecting with Cometh Connect", error)
      if (onConnectError) {
        onConnectError(error)
      } else {
        throw error
      }
    },
    [onConnectError]
  )
  const { connect } = useConnect({
    mutation: {
      onError: handleConnectError,
    },
  })

  const comethConnectConnector = useComethConnectConnector(userWalletAddress)

  return useCallback(() => {
    connect({ connector: comethConnectConnector as any })
  }, [connect, comethConnectConnector])
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
        await connect({ connector } as any)
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

  const initNewSignerRequest = useCallback(
    async (walletAddress: string) => {
      if (!isAddress(walletAddress)) {
        throw new Error("Invalid wallet address.")
      }

      const adaptor = new ConnectAdaptor({
        chainId: chainId,
        apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
        baseUrl: env.NEXT_PUBLIC_COMETH_CONNECT_BASE_URL!,
      })

      return await adaptor.initNewSignerRequest(walletAddress)
    },
    [chainId]
  )

  const retrieveWalletAddress = useCallback(
    async (walletAddress: string) => {
      if (!isAddress(walletAddress)) {
        throw new Error("Invalid wallet address.")
      }
      console.log("Retrieving wallet address", walletAddress)
      const adaptor = new ConnectAdaptor({
        chainId: chainId,
        apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
        baseUrl: env.NEXT_PUBLIC_COMETH_CONNECT_BASE_URL!,
      })
      const wallet = new ComethWallet({
        authAdapter: adaptor,
        apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
        rpcUrl: env.NEXT_PUBLIC_RPC_URL!,
      })
      console.log("Connecting wallet", walletAddress)
      await wallet.connect(walletAddress)
    },
    [chainId]
  )

  const disconnect = useCallback(async () => {
    if (account.isConnected || getUser() !== null) {
      try {
        await walletDisconnect({ connector: account.connector })
        await cosmikDisconnect()
        window.localStorage.removeItem("walletAddress")
        setUser(null)
        setUserIsFullyConnected(false)
      } catch (error) {
        console.error("Error disconnecting wallet", error)
        // Bugsnag.notify(error as Error, function (report) {
        //   report.context = "User Logout from /wallets page"
        //   report.setUser(getUser().id, getUser().email, getUser().userName)
        //   report.addMetadata("user", getUser())
        // })
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
