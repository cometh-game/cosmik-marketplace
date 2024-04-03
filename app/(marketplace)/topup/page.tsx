"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUserAuthContext } from "@/providers/userAuth"
import { useConvertPriceToCrypto } from "@/services/price/priceService"
import {
  useBuildTransakOrder,
  useTransak,
} from "@/services/transak/transakService"
import { useDebounceValue } from "usehooks-ts"
import { parseEther } from "viem"

import { generateRandomUint256 } from "@/lib/utils/generateUint256"
import { Loading } from "@/components/ui/Loading"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { CurrencySwitcher } from "@/components/CurrencySwitcher"
import { TopupCard } from "@/components/topup/TopupCard"
import { TransakSuccessDialog } from "@/components/TransakSucessDialog"

export default function TopupPage() {
  const { push } = useRouter()
  const { mutateAsync: buildTransakOrder } = useBuildTransakOrder()
  const { transakProcessing } = useTransak()
  const { userIsReconnecting, getUser, userIsFullyConnected } =
    useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [showTransakSuccessDialog, setShowTransakSuccessDialog] =
    useState(false)
  const [customAmount, setCustomAmount] = useState<string>("")
  const [debouncedValue] = useDebounceValue(customAmount, 250)
  const [currency, setCurrency] = useState<string>("")
  const currencyInStorage =
  typeof window !== "undefined" && localStorage.getItem("currency")

  useEffect(() => {
    currencyInStorage ? setCurrency(currencyInStorage) : setCurrency("USD")
  }, [])

  useEffect(() => {
    localStorage.setItem("currency", currency)
  }, [currency])

  const initTransakOrder = useCallback(
    async (price: number, amount: number | null) => {
      if (!price || !amount) return
      setIsLoading(true)

      try {
        const orderData = await buildTransakOrder({
          userWallet: getUser().address,
          amount: parseEther(amount.toString()).toString(),
          nonce: generateRandomUint256(),
        })

        transakProcessing({
          data: orderData,
          fiatCurrency: currency,
          defaultFiatAmount: price,
          onSuccess: () => {
            setShowTransakSuccessDialog(true)
          },
        })
      } catch (error: any) {
        toast({
          title: "Error creating the order",
          description: error?.message || "Please try again or contact support",
          variant: "destructive",
          duration: 5000,
        })
      } finally {
        setIsLoading(false)
      }
    },
    [buildTransakOrder, transakProcessing, getUser, currency]
  )

  if (!userIsReconnecting && !userIsFullyConnected) {
    push("/nfts")
    return
  }

  if (userIsReconnecting) {
    return <Loading />
  }

  return (
    <div className="container mx-auto flex max-w-[880px] flex-col items-center gap-4 py-4 pt-[8%] max-sm:pt-4">
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="inline-flex items-center text-[26px] font-semibold">
          Fill your wallet to trade & buy items!
        </h1>
        <CurrencySwitcher currency={currency} onCurrencyChange={setCurrency} />
      </div>
      <div className="grid w-full grid-cols-3 gap-x-8">
        {["25", "50", debouncedValue].map((fiatPrice, index, array) => {
          return (
            <TopupCard
              key={index}
              price={fiatPrice}
              currency={currency}
              onInputChange={(amount) => setCustomAmount(amount)}
              onInit={(amountInETH) =>
                initTransakOrder(Number(fiatPrice), amountInETH)
              }
              isLoading={isLoading}
              isCustom={array.length - 1 === index}
            />
          )
        })}
      </div>
      {showTransakSuccessDialog && (
        <TransakSuccessDialog
          onClose={() => setShowTransakSuccessDialog(false)}
        />
      )}
    </div>
  )
}
