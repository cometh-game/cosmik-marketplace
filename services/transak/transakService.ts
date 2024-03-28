import { useCallback, useState } from "react"
import { useUserAuthContext } from "@/providers/userAuth"
import { useMutation } from "@tanstack/react-query"
import { Transak } from "@transak/transak-sdk"
import { ethers } from "ethers"

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

export const useTransak = ({
  fiatCurrency = "EUR",
}: { fiatCurrency?: string } = {}) => {
  const { getUser } = useUserAuthContext()
  const [iframeSrc, setIframeSrc] = useState("")

  const openTransakDialog = useCallback(
    (transakData: any) => {
      if (!transakData) {
        console.error("Transak data is not available.")
        return
      }

      const sourceTokenData = [
        {
          sourceTokenCode: "ETH",
          sourceTokenAmount: Number.parseFloat(
            ethers.utils.formatEther(transakData.value)
          ),
        },
      ]

      console.log({ transakData })

      const transak = new Transak({
        apiKey: env.NEXT_PUBLIC_TRANSAK_API_KEY,
        network: "arbitrum",
        environment: Transak.ENVIRONMENTS.STAGING,
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
      })

      transak.init()

      Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
        console.log("Widget closed")
      })

      Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log("Success:", orderData)
        // transak.close()
      })

      // return transak
    },
    [fiatCurrency, getUser]
  )

  return { openTransakDialog, iframeSrc }
}
