"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useUserAuthContext } from "@/providers/userAuth"
import { useAuth } from "@/services/cosmik/authService"

import { Loading } from "@/components/ui/Loading"

export default function AuthCallbackPage() {
  const searchParams = useSearchParams()
  const { userIsConnecting, userIsFullyConnected } = useUserAuthContext()
  const code = searchParams.get("code")

  const { verifyOAuthCodeAndSignIn } = useAuth()

  useEffect(() => {
    verifyOAuthCodeAndSignIn(code)
  }, [code])

  if (userIsConnecting && !userIsFullyConnected) {
    return <Loading />
  }

  return null
}
