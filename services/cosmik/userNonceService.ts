import { useMutation } from "@tanstack/react-query"

import { cosmikClient } from "@/lib/clients"

export type GetUserNonceOptions = {
  walletAddress: string
}

export const useGetUserNonce = () => {
  const { mutate, mutateAsync, data, isSuccess } = useMutation({
    mutationKey: ["cosmik", "nonce"],
    mutationFn: async ({ walletAddress }: GetUserNonceOptions) => {
      const { data } = await cosmikClient.post("/auth/init", {
        address: walletAddress,
      })
      return data
    },
  })

  return {
    nonce: data?.data?.nonce,
    getUserNonce: mutate,
    getUserNonceAsync: mutateAsync,
    isGetUserNonceSuccess: isSuccess
  }
}
