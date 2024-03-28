"use client"

import { useState } from "react"
import i18nConfig from "@/i18nConfig"
import { useUserAuthContext } from "@/providers/userAuth"
import {
  useConvertFiatToEth,
  useConvertPriceToFiat,
} from "@/services/price/priceService"
import {
  usePrepareTransakOrder,
  useTransak,
} from "@/services/transak/transakService"
import { ethers } from "ethers"
import { useCurrentLocale } from "next-i18n-router/client"

import { generateRandomUint256 } from "@/lib/utils/generateUint256"
import { FiatPrice } from "@/components/ui/FiatPrice"
import { TopupCard } from "@/components/topup/TopupCard"

export default function TopupPage() {
  const locale = useCurrentLocale(i18nConfig)
  const { mutateAsync: prepareTransakOrder } = usePrepareTransakOrder()
  const { getUser } = useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const { openTransakDialog } = useTransak({
    fiatCurrency: locale === "en" ? "USD" : "EUR",
  })

  const price10InEth = useConvertFiatToEth(10, locale)
  const price25InEth = useConvertFiatToEth(25, locale)
  const price50InEth = useConvertFiatToEth(50, locale)

  console.log("price10InEth", price10InEth)
  console.log("price25InEth", price25InEth)
  console.log("price50InEth", price50InEth)

  const initTransakOrder = (amount: number | null) => {
    if (!amount) return
    const user = getUser()
    setIsLoading(true)

    if (user) {
      prepareTransakOrder({
        userWallet: user.address,
        amount: ethers.utils.parseEther(amount.toString()).toString(),
        nonce: generateRandomUint256(),
      }).then((data) => {
        openTransakDialog(data)
        setIsLoading(false)
      })
    }
  }

  return (
    <div className="container mx-auto flex w-full max-w-[880px] flex-col items-center gap-4 py-4 max-sm:pt-4">
      <div className="flex w-full items-center justify-center gap-2">
        <h1 className="inline-flex items-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Fill your wallet to trade & buy items!
        </h1>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-5">
        <TopupCard
          price={10}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price10InEth}
          onClick={() => initTransakOrder(price10InEth)}
          isLoading={isLoading}
        />
        <TopupCard
          price={25}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price25InEth}
          onClick={() => initTransakOrder(price25InEth)}
          isLoading={isLoading}
        />
        <TopupCard
          price={50}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price50InEth}
          onClick={() => initTransakOrder(price50InEth)}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
