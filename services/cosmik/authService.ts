import { useCallback, useRef, useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"
import { useCosmikOauthCodeVerification } from "@/services/cosmik/oauthService"
import { User } from "@/services/cosmik/signinService"

import { useToast } from "@/components/ui/toast/hooks/useToast"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [displayAuthorizationProcess, setDisplayAuthorizationProcess] = useState(false)
  const { connectComethWallet, retrieveWalletAddress } = useConnectComethWallet()
  const { oauthCodeVerification } = useCosmikOauthCodeVerification()
  const { toast } = useToast()
  const { setUser, setUserIsFullyConnected } = useUserAuthContext()
  const toastShownRef = useRef(false)

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      if (!user) return

      try {
        setIsLoading(true)
        setUser(user)
        // Attempt to retrieve the wallet address to determine if it is the first connection
        await retrieveWalletAddress(user.address)
        // If passkey signer is found for this address, connect the wallet
        await connectComethWallet(user.address)
        // Bugsnag.setUser(user.id, user.email, user.userName)
        // setUserIsFullyConnected(true)

        if (!toastShownRef.current) {
          toast({
            title: "Connexion réussie",
            duration: 3000,
          })
          toastShownRef.current = true
        }
      } catch (error) {
        console.error("Error connecting wallet in SigninDialog", error)
        setDisplayAuthorizationProcess(true)
      } finally {
        setIsLoading(false)
      }
    },
    [
      connectComethWallet,
      retrieveWalletAddress,
      setUser,
      setUserIsFullyConnected,
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
    isLoading,
    displayAuthorizationProcess,
    setDisplayAuthorizationProcess,
    handleLoginSuccess,
    handleGoogleAuth,
  }
}
