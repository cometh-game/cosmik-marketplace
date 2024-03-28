import globalConfig from "@/config/globalConfig"

import { Button } from "../ui/Button"

type TopupCardProps = {
  price: number
  currency: string
  nativeCurrencyPrice: number | null
  onClick: () => void
  isLoading: boolean
}

export function TopupCard({
  price,
  nativeCurrencyPrice,
  currency,
  onClick,
  isLoading,
}: TopupCardProps) {
  return (
    <div className="border-white/0.5 border p-3">
      <div className="text-2xl font-bold">
        {price}
        {currency}
      </div>
      <div className="flex gap-x-2 text-xl font-medium">
        <span>{`≈ ${nativeCurrencyPrice}` ?? "..."}</span>
        {globalConfig.ordersDisplayCurrency.symbol}
      </div>
      <Button
        variant="default"
        onClick={onClick}
        className="mt-2"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Topup
      </Button>
    </div>
  )
}
