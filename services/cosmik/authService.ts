import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"
import { User } from "@/services/cosmik/signinService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { cosmikClient } from "@/lib/clients"
import { toast } from "@/components/ui/toast/hooks/useToast"

export function useAuth() {
  const router = useRouter()
  const { connectComethWallet, retrieveWalletAddress } =
    useConnectComethWallet()
  const {
    setUser,
    setUserIsConnecting,
    setUserIsFullyConnected,
    setDisplayAuthorizationProcess,
    userIsFullyConnected,
    displayAuthorizationProcess,
  } = useUserAuthContext()
  const { oauthCodeVerification } = useCosmikOauthCodeVerification()

  const signIn = useCallback(
    async (user: User) => {
      if (!user || userIsFullyConnected) return
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

  const verifyOAuthCodeAndSignIn = useCallback(
    async (code: string | null) => {
      if (!code) {
        console.error("Code not found")
        router.push("/nfts")
        return
      }
      const { success, user } = await oauthCodeVerification(code)

      if (success) {
        router.push("/nfts")

        if (!displayAuthorizationProcess) {
          await signIn(user)
        }
      }
    },
    [displayAuthorizationProcess]
  )

  return {
    signIn,
    verifyOAuthCodeAndSignIn,
  }
}

export const useCosmikOauthRedirect = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const { mutate: oauthRedirect, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await cosmikClient.post("/oauth/url", {
        redirectUrl: `${origin}/auth/callback`,
      })
      window.location.href = data.url
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as string) || "An error occurred"

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  return { oauthRedirect, isPending }
}

export const useCosmikOauthCodeVerification = () => {
  const client = useQueryClient()
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const { mutateAsync: oauthCodeVerification, isPending } = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await cosmikClient.post("/oauth/authenticate", {
        code,
        redirectUrl: `${origin}/auth/callback`,
      })
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
    },
    onError: (error: AxiosError) => {
      console.error(error)
    },
  })

  return { oauthCodeVerification, isPending }
}
