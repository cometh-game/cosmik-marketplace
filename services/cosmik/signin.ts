import { cosmikClient } from "@/services/clients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { isAddress } from "ethers/lib/utils"

import { toast } from "@/components/ui/toast/use-toast"

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
  const client = useQueryClient()
  
  return useMutation({
    mutationKey: ["cosmik, signin"],
    mutationFn: async (credentials: SignInBody) => {
      const { data } = await cosmikClient.post("/login", credentials)
      return data
    },
    onSuccess: async (data) => {
      if (!isAddress(data.user.walletAddress)) {
        throw new Error("Wallet address is not defined. Please, contact support.")
      }

      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
      
      const hasRetrieveWalletAddressInStorage = localStorage.getItem(
        "hasRetrieveWalletAddress"
      )

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
