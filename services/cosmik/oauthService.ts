import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Router } from "lucide-react"

import { cosmikClient } from "@/lib/clients"
import { toast } from "@/components/ui/toast/hooks/useToast"

export const useCosmikOauthRedirect = () => {
  const origin = typeof window !== "undefined" ? window.location.origin : ""

  const { mutate: oauthRedirect, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await cosmikClient.post("/oauth/url", {
        redirectUrl: `${origin}/auth/callback`,
      })
      window.location.href = data.url
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
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const router = useRouter()

  const { mutateAsync: oauthCodeVerification, isPending } = useMutation({
    mutationFn: async (code: string) => {
      const { data } = await cosmikClient.post("/oauth/authenticate", {
        code,
        redirectUrl: `${origin}/auth/callback`,
      })
      console.log("data", data)
      return data
    },
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["cosmik", "logged"],
      })
    },
    onError: (error: AxiosError) => {
      console.error(error)
    },
  })

  return { oauthCodeVerification, isPending }
}
