import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { SiweMessage } from "siwe"

import { cosmikClient } from "@/lib/clients"

import { toast } from "../ui/toast/hooks/useToast"
import { LegendaReward } from "./types"

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
        title: "Rewards claim successful!",
      })
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      // console.log("error.response?.data?.error", error.response?.data?.error)
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
  rewards: LegendaReward[]
  isLoadingRewards: boolean
} => {
  const { data: rewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ["legenda-rewards"],
    queryFn: () => cosmikClient.get("/legenda/rewards"),
  })

  return { rewards: rewards?.data, isLoadingRewards }
}

export const useClaimRewards = () => {
  const { data: claimRewards, isLoading: isClaimingRewards } = useQuery({
    queryKey: ["legenda-rewards"],
    queryFn: () => cosmikClient.patch("/legenda/claim-rewards"),
  })

  return { claimRewards, isClaimingRewards }
}
