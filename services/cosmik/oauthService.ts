import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"

import { cosmikClient } from "@/lib/clients"
import { toast } from "@/components/ui/toast/hooks/useToast"

export const useCosmikOauthRedirect = () => {
  const client = useQueryClient()

  const { mutate: oauthRedirect, isPending } = useMutation({
    // mutationKey: ["cosmik, oauth"],
    mutationFn: async () => {
      const { data } = await cosmikClient.post("/oauth/url", {
        redirectUrl: "http://localhost:3000/nfts",
      })
      window.location.href = data.url
    },
    onSuccess: () => {
      // client.invalidateQueries({
      //   queryKey: ["cosmik", "logged"],
      // })
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as string) || "An error occurred"

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  return { oauthRedirect, isPending }
}

export const useCosmikOauthCodeVerification = () => {
  const client = useQueryClient()

  const { mutateAsync: oauthCodeVerification, isPending } = useMutation({
    // mutationKey: ["cosmik, oauth"],
    mutationFn: async (code: string) => {
      const { data } = await cosmikClient.post("/oauth/authenticate", {
        code,
        redirectUrl: "http://localhost:3000/nfts",
      })
      console.log("data code verification : ", data)
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as string) || "An error occurred"

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      })
    },
  })

  return { oauthCodeVerification, isPending }
}
