import { cosmikClient } from "@/services/clients"
import { useMutation } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast/hooks/useToast"

interface SignInBody {
  username: string
  password: string
}

export type User = {
  id: string
  address: string
  userName: string
  email: string
  coins: number
  aurium: number
  externalAddresses: Array<string>
}

export const useCosmikSignin = () => {
  return useMutation({
    mutationKey: ["cosmik, signin"],
    mutationFn: async (credentials: SignInBody) => {
      const { data } = await cosmikClient.post("/login", credentials)
      return data
    },
    onSuccess: async (data) => {
      // if (data.user) {
      //   localStorage.setItem("user", JSON.stringify(data.user))
      // }
      const hasRetrieveWalletAddressInStorage = localStorage.getItem("hasRetrieveWalletAddress")

      // if (typeof walletAddress === "undefined" || !walletAddress) {
      //   return push(APP_ROUTES.WALLET_REGISTER.PATH);
      // } else {
      //   if (isConnectKeyStore) {
      //     localStorage.setItem(
      //       "selectedWallet",
      //       JSON.stringify(COMETH_CONNECT_LABEL)
      //     );
      //   }
      //   push(callbackUrl || APP_ROUTES.HOME.PATH);
      // }

      if (hasRetrieveWalletAddressInStorage) {
        toast({
          title: "Login successful",
          duration: 3000,
        })
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast({
          title: "Login failed",
          description: "Please check your username and password",
          variant: "destructive",
          duration: 5000,
        })
      }
    },
  })
}
