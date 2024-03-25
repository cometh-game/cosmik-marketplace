import { useAuthContext } from "@/providers/auth"
import { cosmikClient } from "@/services/clients"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { toast } from "@/components/ui/toast/use-toast"

export const useCosmikLogout = () => {
  const client = useQueryClient()
  const { setUser } = useAuthContext()

  return useMutation({
    mutationKey: ["cosmik, logout"],
    mutationFn: async () => {
      const response = await cosmikClient.post("/auth/disconnect")
      return response
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
      setUser(null)
      localStorage.removeItem("selectedWallet")
      localStorage.removeItem("currentWalletAddress")
      // localStorage.removeItem("hasRetrieveWalletAddress");
      console.log("storage cleared")
      toast({
        title: "You have been disconnected",
        duration: 3000,
      })
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast({
          title: "Logout failed",
          description: "",
          variant: "destructive",
          duration: 5000,
        })
      }
    },
  })
}
