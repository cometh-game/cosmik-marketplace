"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useUserAuthContext } from "@/providers/userAuth"
import { User } from "@/services/cosmik/signinService"
import { useAccount, useDisconnect } from "wagmi"

import { Loading } from "@/components/ui/Loading"
import { toast } from "@/components/ui/toast/hooks/useToast"

const DynamicSigninDialog = dynamic(
  () =>
    import("@/components/signin/SignInDialog").then((mod) => mod.SignInDialog),
  { ssr: false }
)

const DynamicWalletsDialog = dynamic(
  () => import("@/components/WalletsDialog").then((mod) => mod.WalletsDialog),
  { ssr: false }
)

export default function WalletsPage() {
  const {
    userIsConnecting,
    userIsFullyConnected,
    getUser,
    setUser,
    setUserIsFullyConnected,
  } = useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const { disconnectAsync } = useDisconnect()
  const { address: walletAddress } = useAccount()

  useEffect(() => {
    // disconnect wallet if user is already connected
    if (walletAddress) {
      disconnectAsync()
    }
  }, [])

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      try {
        setIsLoading(true)
        setUser(user)
        toast({
          title: "Login successful",
          duration: 3000,
        })
        setUserIsFullyConnected(true)
      } catch (error) {
        console.error("Error connecting wallet", error)
      } finally {
        setIsLoading(false)
      }
    },
    [setUser, setUserIsFullyConnected]
  )

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {userIsConnecting && <Loading />}
      {!userIsFullyConnected && !userIsConnecting ? (
        <DynamicSigninDialog
          onLoginSuccess={handleLoginSuccess}
          isLoading={isLoading}
        />
      ) : (
        <DynamicWalletsDialog user={getUser()} />
      )}
    </div>
  )
}
