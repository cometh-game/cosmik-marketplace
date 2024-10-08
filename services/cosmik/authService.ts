import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useUserAuthContext } from "@/providers/userAuth"
import { useCosmikOauthCodeVerification } from "@/services/cosmik/oauthService"
import { User } from "@/services/cosmik/signinService"

export function useAuth() {
  const router = useRouter()
  const { connectComethWallet, retrieveWalletAddress } =
    useConnectComethWallet()
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const {
    setUser,
    setUserIsConnecting,
    setUserIsFullyConnected,
    setDisplayAuthorizationProcess,
    userIsFullyConnected,
  } = useUserAuthContext()
  const { oauthCodeVerification } = useCosmikOauthCodeVerification()

  const signIn = useCallback(
    async (user: User) => {
      if (!user) return

      try {
        setUserIsConnecting(true)
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
      }
    },
    [connectComethWallet, retrieveWalletAddress]
  )

  const handleOAuthCallback = useCallback(
    async (code: string | null) => {
      const redirectTo = `/nfts/${currentCollectionAddress}`

      if (!code) {
        router.push(redirectTo)
        return
      }

      try {
        const { success, user } = await oauthCodeVerification(code)
        if (success) {
          await signIn(user)
          if (userIsFullyConnected) {
            console.log("user is fully connected", userIsFullyConnected)
            // router.push(redirectTo)
          }
        } else {
          throw new Error("OAuth code verification failed")
        }
      } catch (error) {
        console.error("Error during OAuth code verification", error)
        // router.push("/redirectTo")
      }
    },
    [
      oauthCodeVerification,
      signIn,
      userIsFullyConnected,
      router,
      currentCollectionAddress,
    ]
  )

  return {
    signIn,
    handleOAuthCallback,
  }
}
