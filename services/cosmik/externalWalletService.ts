import { useMutation, useQueryClient } from "@tanstack/react-query"
import { SiweMessage } from "siwe"

import { cosmikClient } from "@/lib/clients"
import { toast } from "@/components/ui/toast/hooks/useToast"

type AddExternalWalletMutationOptions = {
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

export const useRemoveExternalWallet = () => {
  return useMutation({
    mutationKey: ["cosmik, external-addresses"],
    mutationFn: ({ walletAddress }: { walletAddress: string }) =>
      cosmikClient.delete(`/me/external-addresses/${walletAddress}`),
    onSuccess: () => {
      toast({
        title: "Wallet removed",
        description: "Your wallet has been removed from your account",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove wallet",
        description: error?.message || "Please retry or contact support",
        variant: "destructive",
        duration: 5000,
      })
    },
  })
}
