import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { SiweMessage } from "siwe"

import { cosmikClient } from "@/lib/clients"

import { toast } from "../ui/toast/hooks/useToast"
import { LegendaRewards } from "./types"

type RegisterAddressMutationOptions = {
  walletAddress: string
  nonce: string
  signature: string
  message: SiweMessage
}

export const useGetStatus = () => {
  const { data: status, isLoading: isLoadingStatus } = useQuery({
    queryKey: ["legenda-status"],
    queryFn: () => cosmikClient.get("/legenda"),
  })

  return { status: status?.data.claimed, isLoadingStatus }
}

export const useRegisterAddress = () => {
  const queryClient = useQueryClient()

  const { mutateAsync: registerAddress } = useMutation({
    mutationKey: ["legenda-register-address"],
    mutationFn: async ({
      walletAddress,
      nonce,
      signature,
      message,
    }: RegisterAddressMutationOptions) => {
      await cosmikClient.post("/legenda", {
        walletAddress,
        nonce,
        signature,
        message,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legenda-rewards"] })
      toast({
        title: "Your wallet has been linked!",
      })
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      if (
        error.response?.status === 400 &&
        error.response?.data?.error === "WALLET_ALREADY_CLAIMED"
      ) {
        throw new Error("WALLET_ALREADY_CLAIMED")
      }
      if (error.response?.status === 404) {
        toast({
          title: "Something went wrong!",
          description: "Sorry, your not eligible for rewards.",
          variant: "destructive",
        })
      }
    },
  })

  return { registerAddress }
}

export const useGetRewards = (): {
  rewards: LegendaRewards
  isLoadingRewards: boolean
} => {
  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["legenda-rewards"],
    queryFn: () => cosmikClient.get("/legenda/rewards"),
  })

  return { rewards: rewards?.data, isLoadingRewards }
}

export const useClaimRewards = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: claimRewards, data } = useMutation({
    mutationKey: ["legenda-claim-rewards"],
    mutationFn: async () => {
      const response = await cosmikClient.patch("/legenda/claim-rewards")
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["legenda-status"] })
      toast({
        title: "Rewards claimed!",
      })
    },
  })

  return { claimRewards, claimedRewards: data }
}
