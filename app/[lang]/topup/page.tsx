"use client"

import { useEffect, useState } from "react"
import i18nConfig from "@/i18nConfig"
import { useUserAuthContext } from "@/providers/userAuth"
import { useConvertPriceToFiat } from "@/services/price/priceService"
import {
  usePrepareTransakOrder,
  useTransak,
} from "@/services/transak/transakService"
import { useCurrentLocale } from "next-i18n-router/client"
import { parseEther } from "viem"

import { generateRandomUint256 } from "@/lib/utils/generateUint256"
import { Loading } from "@/components/ui/Loading"
import { TopupCard } from "@/components/topup/TopupCard"
import { TransakSuccessDialog } from "@/components/TransakSucessDialog"

export default function TopupPage() {
  const locale = useCurrentLocale(i18nConfig)
  const { mutateAsync: prepareTransakOrder } = usePrepareTransakOrder()
  const { userIsReconnecting, getUser } =
    useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showTransakSuccessDialog, setShowTransakSuccessDialog] =
    useState(false)
  const { openTransakDialog } = useTransak()
  const [customAmount, setCustomAmount] = useState<number | null>(null)

  const price25InEth = useConvertPriceToFiat(25, locale, 4)
  const price50InEth = useConvertPriceToFiat(50, locale, 4)
  const priceCustomInEth = useConvertPriceToFiat(customAmount, locale, 4)
  console.log("price25InEth", price25InEth)
  console.log("priceCustomInEth", priceCustomInEth)

  const handleCustomAmountChange = (amount: number) => {
    setCustomAmount(amount)
    console.log("customAmount", customAmount)
  }

  const initTransakOrder = (price: number, amount: number | null) => {
    if (!price || !amount) return
    const user = getUser()
    setIsLoading(true)

    if (user) {
      prepareTransakOrder({
        userWallet: user.address,
        amount: parseEther(amount.toString()).toString(),
        nonce: generateRandomUint256(),
      }).then((transakData) => {
        openTransakDialog({
          transakData,
          fiatCurrency: locale === "en" ? "USD" : "EUR",
          defaultFiatAmount: price,
          onSuccess: () => {
            setShowTransakSuccessDialog(true)
          },
        })
        setIsLoading(false)
      })
    }
  }

  if (userIsReconnecting) {
    return <Loading />
  }

  return (
    <div className="container mx-auto flex max-w-[880px] flex-col items-center gap-4 py-4 pt-[8%] max-sm:pt-4">
      <h1 className="mb-10 inline-flex items-center text-[26px] font-semibold">
        Fill your wallet to trade & buy items!
      </h1>
      <div className="grid w-full grid-cols-3 gap-x-8">
        <TopupCard
          price={25}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price25InEth}
          onInit={() => initTransakOrder(20, price25InEth)}
          isLoading={isLoading}
        />
        <TopupCard
          price={50}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price50InEth}
          onInit={() => initTransakOrder(50, price50InEth)}
          isLoading={isLoading}
        />
        <TopupCard
          price={customAmount ?? 0}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={priceCustomInEth}
          onInputChange={(amount) => handleCustomAmountChange(Number(amount))}
          onInit={() => initTransakOrder(customAmount ?? 0, priceCustomInEth)}
          isLoading={isLoading}
          isCustom
        />
      </div>
      {showTransakSuccessDialog && (
        <TransakSuccessDialog
          onClose={() => setShowTransakSuccessDialog(false)}
        />
      )}
    </div>
  )
}
