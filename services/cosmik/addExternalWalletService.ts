import { useMutation } from "@tanstack/react-query"
import { SiweMessage } from "siwe"

import { cosmikClient } from "@/lib/clients"
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
    mutationFn: ({
      walletAddress,
      nonce,
      signature,
      message,
    }: AddExternalWalletMutationOptions) =>
      cosmikClient.patch("/me/external-addresses", {
        walletAddress,
        nonce,
        signature,
        message,
      }),
    onSuccess: () => {
      toast({
        title: "Wallet added",
        description: "Your wallet has been added to your account",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to add wallet",
        description: error?.message || "Please retry or contact support",
        variant: "destructive",
        duration: 5000,
      })
    },
  })
}
