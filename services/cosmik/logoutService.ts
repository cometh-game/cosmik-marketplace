import { useMutation, useQueryClient } from "@tanstack/react-query"

import { cosmikClient } from "@/lib/clients"
import { toast } from "@/components/ui/toast/hooks/useToast"

export const useCosmikLogout = () => {
  const client = useQueryClient()

  return useMutation({
    mutationKey: ["cosmik, logout"],
    mutationFn: async () => {
      const response = await cosmikClient.post("/auth/disconnect")
      return response
    },
    onSuccess: () => {
      client.resetQueries({
        queryKey: ["cosmik", "logged"],
      })
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
