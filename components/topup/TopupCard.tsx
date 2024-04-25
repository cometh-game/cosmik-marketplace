import { useState } from "react"
import { useConvertPriceToFiat } from "@/services/price/priceService"

import globalConfig from "@/config/globalConfig"
import { Input } from "@/components/ui/Input"

import { Button } from "../ui/Button"

type TopupCardProps = {
  amount: string
  currency: string
  onInputChange?: (value: string) => void
  onInit: (price: number | null) => Promise<void>
  isCustom?: boolean
}

export function TopupCard({
  amount,
  currency,
  onInputChange,
  onInit,
  isCustom = false,
}: TopupCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const price = useConvertPriceToFiat(parseFloat(amount), currency)

  const handleTopup = async () => {
    setIsLoading(true)
    try {
      await onInit(price)
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la commande", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card-secondary px-8 pb-8 pt-10 text-center">
      {isCustom ? (
        <Input
          placeholder="Your custom amount"
          inputUpdateCallback={onInputChange}
          className="mb-4"
        />
      ) : (
        <div className="text-6xl font-bold italic tracking-wide text-[#FFD7D9] drop-shadow-[3px_3px_0_rgba(54,14,59,1)]">
          {amount}
          <span className="ml-0.5 text-3xl">
            {globalConfig.ordersDisplayCurrency.symbol}
          </span>
        </div>
      )}
      <div className="text-2xl font-medium tracking-wide text-white/50">
        {price !== null ? (
          <>
            {`≈ ${price.toFixed(0)}` ?? "..."}
            <span className="ml-0.5">{currency}</span>
          </>
        ) : (
          "..."
        )}
      </div>
      <Button
        variant="cosmik-price"
        onClick={handleTopup}
        className="mt-3 w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Topup
      </Button>
    </div>
  )
}
