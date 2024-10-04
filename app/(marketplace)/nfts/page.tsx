"use client"

import { useEffect } from "react"
import { redirect, useRouter, useSearchParams } from "next/navigation"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useUserAuthContext } from "@/providers/userAuth"
import { useAuth } from "@/services/cosmik/authService"

import { AuthorizationProcess } from "@/components/connect-actions/buttons/AuthorizationProcess"

export default function MarketplacePage() {
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const searchParams = useSearchParams()
  const code = searchParams.get("code")
  const router = useRouter()
  const {
    isLoading,
    displayAuthorizationProcess,
    setDisplayAuthorizationProcess,
    handleGoogleAuth,
  } = useAuth()
  const { getUser } = useUserAuthContext()

  useEffect(() => {
    if (code) {
      handleGoogleAuth(code)
    } else {
      router.push(`/nfts/${currentCollectionAddress}`)
    }
  }, [code, handleGoogleAuth, currentCollectionAddress])

  if (isLoading) {
    return <div>Authentification...</div>
  }

  if (displayAuthorizationProcess) {
    return (
      <AuthorizationProcess
        isOpen={displayAuthorizationProcess}
        onClose={() => setDisplayAuthorizationProcess(false)}
        user={getUser()!}
      />
    )
  }

  return null
}
