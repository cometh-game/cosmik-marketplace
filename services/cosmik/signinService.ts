import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cosmikClient } from "@/lib/clients"
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
  const client = useQueryClient()

  return useMutation({
    mutationKey: ["cosmik, signin"],
    mutationFn: async (credentials: SignInBody) => {
      const { data } = await cosmikClient.post("/login", credentials)
      if (typeof data.user.address === "undefined" || !data.user.address) {
        throw new Error("Wallet address is not defined. Please contact support")
      }
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast({
          title: "Login failed",
          description: "Please check your username and password",
          variant: "destructive",
          duration: 5000,
        })
      } else {
        toast({
          title: "Error",
          description: error?.message || "An error occurred",
          variant: "destructive",
          duration: 5000,
        })
      }
    },
  })
}
