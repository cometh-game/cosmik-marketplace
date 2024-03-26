import { cosmikClient } from "@/services/clients"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast/use-toast"
import { isAddress } from "ethers/lib/utils"

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
      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
      if (!data.user.address || !isAddress(data.user.address)) {
        throw new Error("Wallet address is not defined. Please, contact support.")
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
