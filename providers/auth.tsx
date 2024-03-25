import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useCosmikLogged } from "@/services/cosmik/logged"

const AuthContext = createContext<{
  getUser: () => any | null
  setUser: (newValue: any) => any
  userLogged: any
  isFetchingUserLogged: boolean
  isUserLoggedFetched?: boolean
}>({
  getUser: () => null,
  setUser: () => null,
  userLogged: null,
  isFetchingUserLogged: false,
  isUserLoggedFetched: false,
})

export function useAuthContext() {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { userLogged, isFetchingUserLogged, isUserLoggedFetched } =
    useCosmikLogged()
  const user = useRef<any | null>(null)

  function setUser(newValue: any) {
    user.current = newValue
    return user.current
  }

  function getUser() {
    return user.current
  }

  useEffect(() => {
    if (!isFetchingUserLogged) {
      setUser(userLogged)
    }
  }, [userLogged, isFetchingUserLogged, user])

  return (
    <AuthContext.Provider
      value={{
        getUser,
        setUser,
        userLogged,
        isFetchingUserLogged,
        isUserLoggedFetched,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
