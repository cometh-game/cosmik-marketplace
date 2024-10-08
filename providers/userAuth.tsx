import { createContext, useContext, useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useUserIsLogged } from "@/services/cosmik/userLoggedService"

import { toast } from "@/components/ui/toast/hooks/useToast"

import { useConnectComethWallet } from "./authentication/comethConnectHooks"

const UserAuthContext = createContext<{
  getUser: () => any | null
  setUser: (newValue: any) => any
  userIsConnecting: boolean
  setUserIsConnecting: (value: boolean) => void
  userIsFullyConnected: boolean
  setUserIsFullyConnected: (value: boolean) => void
  displayAuthorizationProcess: boolean
  setDisplayAuthorizationProcess: (value: boolean) => void
}>({
  getUser: () => null,
  setUser: () => null,
  userIsConnecting: false,
  setUserIsConnecting: () => null,
  userIsFullyConnected: false,
  setUserIsFullyConnected: () => null,
  displayAuthorizationProcess: false,
  setDisplayAuthorizationProcess: () => null,
})

export function useUserAuthContext() {
  return useContext(UserAuthContext)
}

export const UserAuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const user = useRef<any | null>(null)
  const { userLogged, isFetchingUserLogged } = useUserIsLogged()
  const [userIsFullyConnected, setUserIsFullyConnected] = useState(false)
  const { connectComethWallet, disconnect } = useConnectComethWallet()
  const [userIsConnecting, setUserIsConnecting] = useState(false)
  const [displayAuthorizationProcess, setDisplayAuthorizationProcess] =
    useState(false)

  const pathname = usePathname()
  const isWalletConnectionNotRequired =
    pathname === "/wallets" || pathname === "/legenda-program"

  const currentWalletInStorage =
    typeof window !== "undefined" &&
    window.localStorage.getItem("walletAddress")

  function setUser(newValue: any) {
    user.current = newValue
    return user.current
  }

  function getUser() {
    return user.current
  }

  useEffect(() => {
    const reconnectingWallet = async () => {
      if (!userLogged || !userLogged.address) return

      setUserIsConnecting(true)
      setUser(userLogged)

      if (isWalletConnectionNotRequired) {
        setUserIsFullyConnected(true)
        setUserIsConnecting(false)
        return
      }

      try {
        await connectComethWallet(userLogged.address)
        setUserIsFullyConnected(true)
      } catch (error) {
        console.error("Error reconnecting wallet", error)
        setUserIsFullyConnected(false)
      } finally {
        setUserIsConnecting(false)
      }
    }

    if (
      !isFetchingUserLogged &&
      (currentWalletInStorage || isWalletConnectionNotRequired)
    ) {
      reconnectingWallet()
    }
  }, [
    userLogged,
    isFetchingUserLogged,
    currentWalletInStorage,
    isWalletConnectionNotRequired,
    connectComethWallet,
  ])

  useEffect(() => {
    if (userIsFullyConnected) {
      toast({
        title: "Login successful",
        duration: 3000,
      })
    }
  }, [userIsFullyConnected])

  return (
    <UserAuthContext.Provider
      value={{
        getUser,
        setUser,
        userIsConnecting,
        setUserIsConnecting,
        userIsFullyConnected,
        setUserIsFullyConnected,
        displayAuthorizationProcess,
        setDisplayAuthorizationProcess,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}
