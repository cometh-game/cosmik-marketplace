import { cosmikClient } from "@/lib/clients"
import { useMutation } from "@tanstack/react-query"
import { SiweMessage } from "siwe"
import { Address } from "viem"

import { toast } from "@/components/ui/toast/hooks/useToast"

export type AddExternalWalletMutationOptions = {
  walletAddress: string
  nonce: string
  signature: string
  message: SiweMessage
}

export const useAddExternalWallet = () => {
  return useMutation({
    mutationKey: ["cosmik, external-addresses"],
    mutationFn: async ({
      walletAddress,
      nonce,
      signature,
      message,
    }: AddExternalWalletMutationOptions) => {
      const { data } = await cosmikClient.patch("/me/external-addresses", {
        walletAddress,
        nonce,
        signature,
        message,
      })
      return data
    },
    onSuccess: async () => {
      toast({
        title: "Wallet added",
        description: "Your wallet has been added to your account",
      })
    },
    onError: (error: any) => {
      if (error.response?.status === 400) {
        toast({
          title: "Failed to add wallet",
          description: "Please retry or contact support",
          variant: "destructive",
          duration: 5000,
        })
      }
    },
  })
}
