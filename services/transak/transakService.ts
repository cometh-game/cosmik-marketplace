import { useCallback, useState } from "react"
import { useUserAuthContext } from "@/providers/userAuth"
import { useMutation } from "@tanstack/react-query"
import { Transak } from "@transak/transak-sdk"
import { formatEther } from "viem"

import { env } from "@/config/env"
import { transakClient } from "@/lib/clients"

type UseBuildTransakOptions = {
  userWallet: string
  amount: string
  nonce: string
}

export const useBuildTransakOrder = () => {
  return useMutation({
    mutationFn: async ({
      userWallet,
      amount,
      nonce,
    }: UseBuildTransakOptions) => {
      const { data } = await transakClient.post("/transak", {
        userWallet,
        amount,
        nonce,
      })
      return data
    },
  })
}

type useTransakOptions = {
  data: any
  fiatCurrency: string
  defaultFiatAmount: number
  onSuccess: () => void
}

export const useTransak = () => {
  const { getUser } = useUserAuthContext()

  const transakProcessing = useCallback(
    ({
      data,
      fiatCurrency,
      defaultFiatAmount,
      onSuccess,
    }: useTransakOptions) => {
      if (!data) {
        console.error("Transak data is not available.")
        return
      }

      const { value, estimatedGasLimit, smartContractAddress } = data

      const sourceTokenData = [
        {
          sourceTokenCode: "ETH",
          sourceTokenAmount: Number.parseFloat(formatEther(value)),
        },
      ]

      const transak = new Transak({
        apiKey: env.NEXT_PUBLIC_TRANSAK_API_KEY,
        network: "arbitrum",
        environment: Transak.ENVIRONMENTS.STAGING,
        estimatedGasLimit,
        smartContractAddress,
        walletAddress: getUser().address,
        sourceTokenData: sourceTokenData,
        isTransakOne: true,
        disableWalletAddressForm: true,
        calldata: data.calldata,
        email: getUser().email,
        themeColor: "#222249",
        hideMenu: true,
        exchangeScreenTitle: "Buy ETH on Muster",
        cryptoAmount: data.value,
        fiatCurrency,
        defaultFiatAmount,
        defaultPaymentMethod: "credit_debit_card",
      })

      transak.init()

      Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log("Transak order successful", orderData)
        transak.close()
        onSuccess()
      })
    },
    [getUser]
  )

  return { transakProcessing }
}
