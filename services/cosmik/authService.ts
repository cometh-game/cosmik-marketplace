import { useCallback } from "react"
import { useAuthContext } from "@/providers/cosmikAuth"

import { cosmikClient } from "../clients"

export enum AuthStatus {
  Unknow = 0,
  Authenticated = 1,
  Guest = 2,
}

export const useCosmikAuth = () => {
  const { account, setAccount } = useAuthContext()

  let status = AuthStatus.Unknow

  switch (account) {
    case null:
      status = AuthStatus.Guest
      break
    case undefined:
      status = AuthStatus.Unknow
      break
    default:
      status = AuthStatus.Authenticated
      break
  }

  const authentificate = useCallback(async () => {
    await cosmikClient
      .get("/auth/authenticated")
      .then((response) => {
        setAccount(response.data)
      })
      .catch(() => {
        setAccount(null)
      })
  }, [])

  return {
    status,
    account,
    authentificate,
  }
}
