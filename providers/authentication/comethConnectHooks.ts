import { useCallback, useMemo } from "react"
import { useCosmikLogout } from "@/services/cosmik/logoutService"
import {
  ComethWallet,
  ConnectAdaptor,
  SupportedNetworks,
} from "@cometh/connect-sdk"
import { comethConnectConnector } from "@cometh/connect-sdk-viem"
import { isAddress, numberToHex } from "viem"
import { useAccount, useConnect, useDisconnect } from "wagmi"

import { env } from "@/config/env"

import { useUserAuthContext } from "../userAuth"

export const useIsComethConnectWallet = () => {
  const { connector } = useAccount()
  return useMemo(() => connector?.type === "cometh", [connector])
}

export const useConnectComethWallet = () => {
  const { connectAsync: connect } = useConnect()
  const { disconnectAsync: walletDisconnect } = useDisconnect()
  const { mutateAsync: cosmikDisconnect } = useCosmikLogout()
  const { getUser, setUser, setUserIsFullyConnected } = useUserAuthContext()
  const account = useAccount()

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
        // console.log("Connected to wallet")
        // console.log("Account", account)
        // if (account.isConnected && account.address !== walletAddress) {
        //   // disconnect()
        //   throw new Error(
        //     "Your Cosmik wallet address doesn't match the one stored in your browser. Please contact support"
        //   )
        // }
      } catch (error) {
        console.error("Error connecting wallet", error)
      }
    },
    [connect]
  )

  const initNewSignerRequest = useCallback(async (walletAddress: string) => {
    const adaptor = new ConnectAdaptor({
      chainId: numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks,
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
    const adaptor = new ConnectAdaptor({
      chainId: numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks,
      apiKey: env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
      baseUrl: process.env.NEXT_PUBLIC_COMETH_CONNECT_BASE_URL!,
    })
    const wallet = new ComethWallet({
      authAdapter: adaptor,
      apiKey: process.env.NEXT_PUBLIC_COMETH_CONNECT_API_KEY!,
    })
    await wallet.connect(walletAddress)
  }, [])

  const disconnect = useCallback(async () => {
    if (account.isConnected || getUser() !== null) {
      console.log("Disconnecting wallet", account)
      try {
        await walletDisconnect({ connector: account.connector })
        await cosmikDisconnect()
        // window.localStorage.removeItem("walletAddress")
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
