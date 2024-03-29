"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"
import { User } from "@/services/cosmik/signinService"

import { Loading } from "@/components/ui/Loading"
import { toast } from "@/components/ui/toast/hooks/useToast"

const DynamicSigninDialog = dynamic(
  () =>
    import("../../../components/signin/SignInDialog").then(
      (mod) => mod.SignInDialog
    ),
  { ssr: false }
)

const DynamicWalletsDialog = dynamic(
  () =>
    import("../../../components/WalletsDialog").then(
      (mod) => mod.WalletsDialog
    ),
  { ssr: false }
)

export default function WalletsPage() {
  const { userIsReconnecting, userIsFullyConnected, getUser, setUser } =
    useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const { connectComethWallet } = useConnectComethWallet()

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      try {
        setIsLoading(true)
        setUser(user)
        await connectComethWallet(user.address)
        toast({
          title: "Login successful",
          duration: 3000,
        })
      } catch (error) {
        console.error("Error connecting wallet", error)
      } finally {
        setIsLoading(false)
      }
    },
    [connectComethWallet]
  )
  console.log("userIsReconnecting", userIsReconnecting)
  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {userIsReconnecting && <Loading />}
      {!userIsFullyConnected && !userIsReconnecting ? (
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
