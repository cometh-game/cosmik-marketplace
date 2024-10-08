"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useUserAuthContext } from "@/providers/userAuth"
import { useAuth } from "@/services/cosmik/authService"

import { Loading } from "@/components/ui/Loading"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const { handleOAuthCallback } = useAuth()
  const { userIsConnecting, userIsFullyConnected } = useUserAuthContext()

  // We need to disable strict mode locally to make the first connection flow with Google
  useEffect(() => {
    const code = searchParams.get("code")
    handleOAuthCallback(code)
  }, [searchParams, handleOAuthCallback])

  if (userIsConnecting && !userIsFullyConnected) {
    return <Loading />
  }

  return null
}
