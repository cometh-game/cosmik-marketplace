import { useCallback, useMemo } from "react"
import { useCosmikLogout } from "@/services/cosmik/logoutService"
import {
  ComethProvider,
  ComethWallet,
  ConnectAdaptor,
  ConnectOnboardConnector,
  NewSignerRequestBody,
  NewSignerRequestType,
  SendTransactionResponse,
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
        // console.log("getUser() in connectComethWallet", getUser())
        // if (!isAddress(walletAddress)) {
        //   throw new Error("Invalid wallet address. Please contact support")
        // } else if (walletAddress !== getUser().address) {
        //   throw new Error(
        //     "Your Cosmik wallet address doesn't match the one stored in your browser. Please contact support"
        //   )
        // }

        await connect({ connector })
      } catch (error) {
        console.error("Error connecting wallet", error)
      }
    },
    [connect]
  )

  const disconnect = useCallback(async () => {
    if (account.status === "connected" && getUser()) {
      try {
        await walletDisconnect({ connector: account.connector })
        await cosmikDisconnect()
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
    disconnect,
  }
}
