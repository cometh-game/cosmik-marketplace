"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { User } from "@/services/cosmik/signinService"

const DynamicSigninDialog = dynamic(
  () =>
    import("../../components/signin/SignInDialog").then(
      (mod) => mod.SignInDialog
    ),
  { ssr: false }
)

const DynamicWalletsDialog = dynamic(
  () =>
    import("../../components/WalletsDialog").then(
      (mod) => mod.WalletsDialog
    ),
  { ssr: false }
)

export default function WalletsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  function handleLoginSuccess(user: User) {
    setIsLoggedIn(true)
    setUser(user)
  }

  return (
    <div className="container mx-auto flex items-center justify-center gap-4 py-5 sm:py-6">
      {!isLoggedIn && <DynamicSigninDialog onLoginSuccess={handleLoginSuccess} />}
      {isLoggedIn && user && <DynamicWalletsDialog user={user} />}
    </div>
  )
}
