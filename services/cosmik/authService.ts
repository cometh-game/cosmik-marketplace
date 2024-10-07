import { useCallback, useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"
import { useCosmikOauthCodeVerification } from "@/services/cosmik/oauthService"
import { User } from "@/services/cosmik/signinService"

export function useAuth() {
  const [displayAuthorizationProcess, setDisplayAuthorizationProcess] =
    useState(false)
  const { connectComethWallet, retrieveWalletAddress } =
    useConnectComethWallet()
  const { oauthCodeVerification } = useCosmikOauthCodeVerification()
  const { setUser, setUserIsConnecting, setUserIsFullyConnected } =
    useUserAuthContext()

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      if (!user) return

      try {
        setUserIsConnecting(true)
        console.log("user in handleLoginSuccess : ", user)
        setUser(user)
        // Attempt to retrieve the wallet address to determine if it is the first connection
        await retrieveWalletAddress(user.address)
        // If passkey signer is found for this address, connect the wallet
        await connectComethWallet(user.address)
        // Bugsnag.setUser(user.id, user.email, user.userName)
        setUserIsFullyConnected(true)
      } catch (error) {
        console.error("Error connecting wallet in SigninDialog", error)
        setDisplayAuthorizationProcess(true)
      } finally {
        setUserIsConnecting(false)
      }
    },
    [
      connectComethWallet,
      retrieveWalletAddress,
      // setUser,
      // setUserIsFullyConnected,
    ]
  )

  const handleGoogleAuth = useCallback(
    async (code: string) => {
      try {
        const { user } = await oauthCodeVerification(code)
        await handleLoginSuccess(user)
      } catch (error) {
        console.error("Google authentication failed", error)
      }
    },
    [handleLoginSuccess, oauthCodeVerification]
  )

  return {
    displayAuthorizationProcess,
    setDisplayAuthorizationProcess,
    handleLoginSuccess,
    handleGoogleAuth,
  }
}
