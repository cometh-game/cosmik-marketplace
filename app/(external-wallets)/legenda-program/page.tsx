"use client"

import { useCallback, useState } from "react"
import dynamic from "next/dynamic"
import { useUserAuthContext } from "@/providers/userAuth"
import { User } from "@/services/cosmik/signinService"

import { Loading } from "@/components/ui/Loading"
import { toast } from "@/components/ui/toast/hooks/useToast"

const DynamicSigninDialog = dynamic(
  () =>
    import("@/components/signin/SignInDialog").then((mod) => mod.SignInDialog),
  { ssr: false }
)

const DynamicLegendaProgramProcess = dynamic(
  () =>
    import("@/components/legenda-program/LegendaProgramProcess").then(
      (mod) => mod.LegendaProgramProcess
    ),
  { ssr: false }
)

export default function LegendaProgramPage() {
  const {
    userIsConnecting,
    userIsFullyConnected,
    getUser,
    setUser,
    setUserIsFullyConnected,
  } = useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      try {
        setIsLoading(true)
        setUser(user)
        setUserIsFullyConnected(true)
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
    [setUser, setUserIsFullyConnected]
  )

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {(userIsConnecting || isLoading) && <Loading />}
      {!userIsFullyConnected && !userIsConnecting ? (
        <DynamicSigninDialog
          onLoginSuccess={handleLoginSuccess}
          isLoading={isLoading}
        />
      ) : (
        <DynamicLegendaProgramProcess user={getUser()} />
      )}
    </div>
  )
}
