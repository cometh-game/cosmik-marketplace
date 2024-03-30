import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useUserIsLogged } from "@/services/cosmik/userLoggedService"

import { useConnectComethWallet } from "./authentication/comethConnectHooks"
import { usePathname } from "next/navigation"

const UserAuthContext = createContext<{
  getUser: () => any | null
  setUser: (newValue: any) => any
  userIsReconnecting: boolean
  userIsFullyConnected: boolean
  setUserIsFullyConnected: (val: boolean) => void
}>({
  getUser: () => null,
  setUser: () => null,
  userIsReconnecting: false,
  userIsFullyConnected: false,
  setUserIsFullyConnected: () => null,
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
  const { connectComethWallet } = useConnectComethWallet()
  const [userIsReconnecting, setUserIsReconnecting] = useState(false)
  const pathname = usePathname()
  const isWalletsPage = pathname === "/wallets"

  function setUser(newValue: any) {
    user.current = newValue
    return user.current
  }

  function getUser() {
    return user.current
  }

  useEffect(() => {
    // Initiate reconnection as soon as you start checking the connection status
    setUserIsReconnecting(true)
    // If the user has logged in, Wagmi has set the wallet address in local storage
    // const getWalletInStorage = window.localStorage.getItem("walletAddress")

    const reconnectingWallet = async () => {
      // If the user is logged in and has an address, attempt to connect the wallet
      if (userLogged && userLogged.address) {
        setUser(userLogged)
        
        if (isWalletsPage) {
          setUserIsReconnecting(false)
          setUserIsFullyConnected(true)
          return
        }

        try {
          await connectComethWallet(userLogged.address)
          setUserIsFullyConnected(true)
        } catch (error) {
          console.error("Erreur lors de la connexion au wallet", error)
          setUserIsFullyConnected(false)
        }
      }
      // Make sure to update the reconnection status to false after verification
      setUserIsReconnecting(false)
    }

    if (!isFetchingUserLogged) {
      reconnectingWallet()
    }
  }, [userLogged, isFetchingUserLogged, connectComethWallet])

  return (
    <UserAuthContext.Provider
      value={{
        getUser,
        setUser,
        userIsReconnecting,
        userIsFullyConnected,
        setUserIsFullyConnected,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}
