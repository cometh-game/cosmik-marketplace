import { useCallback, useState } from "react"
import { useUserAuthContext } from "@/providers/userAuth"
import { useMutation } from "@tanstack/react-query"
import { Transak } from "@transak/transak-sdk"
import { formatEther } from "viem"

import { env } from "@/config/env"
import { transakClient } from "@/lib/clients"

export type UsePrepareOnrampOptions = {
  userWallet: string
  amount: string
  nonce: string
}

export const usePrepareTransakOrder = () => {
  return useMutation({
    mutationFn: async ({
      userWallet,
      amount,
      nonce,
    }: UsePrepareOnrampOptions) => {
      const { data } = await transakClient.post("/transak", {
        userWallet,
        amount,
        nonce,
      })
      return data
    },
  })
}

export const useTransak = () => {
  const { getUser } = useUserAuthContext()

  const openTransakDialog = useCallback(
    ({
      transakData,
      fiatCurrency,
      defaultFiatAmount,
      onSuccess,
    }: {
      transakData: any
      fiatCurrency: string
      defaultFiatAmount: number
      onSuccess?: () => void
    }) => {
      if (!transakData) {
        console.error("Transak data is not available.")
        return
      }

      const sourceTokenData = [
        {
          sourceTokenCode: "ETH",
          sourceTokenAmount: Number.parseFloat(formatEther(transakData.value)),
        },
      ]

      const transak = new Transak({
        apiKey: env.NEXT_PUBLIC_TRANSAK_API_KEY,
        network: "arbitrum",
        environment:
          process.env.NODE_ENV === "production"
            ? Transak.ENVIRONMENTS.PRODUCTION
            : Transak.ENVIRONMENTS.STAGING,
        estimatedGasLimit: transakData.estimatedGasLimit,
        smartContractAddress: transakData.smartContractAddress,
        walletAddress: getUser().address,
        sourceTokenData: sourceTokenData,
        isTransakOne: true,
        disableWalletAddressForm: true,
        calldata: transakData.calldata,
        email: getUser().email,
        themeColor: "#222249",
        hideMenu: true,
        exchangeScreenTitle: "Buy ETH on Muster",
        cryptoAmount: transakData.value,
        fiatCurrency,
        defaultFiatAmount,
        defaultPaymentMethod: "credit_debit_card",
      })

      transak.init()

      Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        transak.close()
        if (onSuccess) onSuccess()
      })
    },
    [getUser]
  )

  return { openTransakDialog }
}
