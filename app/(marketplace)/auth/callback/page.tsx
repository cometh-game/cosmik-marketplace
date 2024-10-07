"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useUserAuthContext } from "@/providers/userAuth"
import { useAuth } from "@/services/cosmik/authService"

import { Loading } from "@/components/ui/Loading"

export default function Page() {
  const searchParams = useSearchParams()
  const code = searchParams.get("code")

  const router = useRouter()

  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { displayAuthorizationProcess, handleGoogleAuth } = useAuth()
  const { userIsConnecting, setUserIsConnecting } = useUserAuthContext()

  useEffect(() => {
    const handleAuth = async () => {
      const redirectTo = `/nfts/${currentCollectionAddress}`

      if (code) {
        try {
          setUserIsConnecting(true)
          await handleGoogleAuth(code)
          if (!displayAuthorizationProcess) {
            router.push(redirectTo)
          }
        } catch (error) {
          console.error(error)
        }
      } else {
        router.push(redirectTo)
      }
    }

    handleAuth()
  }, [
    code,
    currentCollectionAddress,
    handleGoogleAuth,
    displayAuthorizationProcess,
  ])

  if (userIsConnecting || displayAuthorizationProcess) {
    return <Loading />
  }

  return null
}
