import { useConvertPriceToCrypto } from "@/services/price/priceService"

import globalConfig from "@/config/globalConfig"
import { Input } from "@/components/ui/Input"

import { Button } from "../ui/Button"

type TopupCardProps = {
  price: string
  currency: string
  onInputChange?: (value: string) => void
  onInit: (amount: number | null) => void
  isLoading: boolean
  isCustom?: boolean
}

export function TopupCard({
  price,
  currency,
  onInputChange,
  onInit,
  isLoading,
  isCustom = false,
}: TopupCardProps) {
  const amountInETH = useConvertPriceToCrypto(Number(price), currency)

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
          {price}
          <span className="ml-0.5 text-3xl">{currency}</span>
        </div>
      )}
      <div className="text-2xl font-medium tracking-wide text-white/50">
        {amountInETH !== null ? (
          <>
            {`≈ ${amountInETH}` ?? "..."}
            <span className="ml-0.5">
              {globalConfig.ordersDisplayCurrency.symbol}
            </span>
          </>
        ) : (
          "..."
        )}
      </div>
      <Button
        variant="cosmik-price"
        onClick={() => amountInETH && onInit(amountInETH)}
        className="mt-3 w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Topup
      </Button>
    </div>
  )
}
