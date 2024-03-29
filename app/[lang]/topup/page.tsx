"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  const { push } = useRouter()
  const { mutateAsync: prepareTransakOrder } = usePrepareTransakOrder()
  const { userIsReconnecting, userIsFullyConnected, getUser } =
    useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showTransakSuccessDialog, setShowTransakSuccessDialog] =
    useState(false)
  const { openTransakDialog } = useTransak()

  const price10InEth = useConvertPriceToFiat(20, locale, 4)
  const price25InEth = useConvertPriceToFiat(30, locale, 4)
  const price50InEth = useConvertPriceToFiat(50, locale, 4)

  console.log("price25InEth", price25InEth)

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

  // if (!userIsReconnecting && !userIsFullyConnected) {
  //   push("/")
  //   return
  // }

  return (
    <div className="container mx-auto flex w-full max-w-[880px] flex-col items-center gap-4 py-4 max-sm:pt-4">
      <div className="flex w-full items-center justify-center gap-2">
        <h1 className="inline-flex items-center text-2xl font-semibold tracking-tight sm:text-3xl">
          Fill your wallet to trade & buy items!
        </h1>
      </div>
      <div className="grid w-full grid-cols-3 gap-x-5">
        <TopupCard
          price={20}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price10InEth}
          onClick={() => initTransakOrder(20, price10InEth)}
          isLoading={isLoading}
        />
        <TopupCard
          price={30}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price25InEth}
          onClick={() => initTransakOrder(30, price25InEth)}
          isLoading={isLoading}
        />
        <TopupCard
          price={50}
          currency={locale === "en" ? "$" : "€"}
          nativeCurrencyPrice={price50InEth}
          onClick={() => initTransakOrder(50, price50InEth)}
          isLoading={isLoading}
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
