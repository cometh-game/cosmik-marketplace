import { manifest } from "@/manifests/manifests"
import { useConvertPriceToFiat } from "@/services/price/priceService"

import { cn } from "@/lib/utils/utils"

type FiatPriceProps = {
  amount: string
  className?: string
}

export const FiatPrice = ({ amount, className }: FiatPriceProps) => {
  const fiatPrice = useConvertPriceToFiat(parseFloat(amount))

  return (
    fiatPrice !== null && (
      <span
        className={cn("font-semibold text-white/80", className)}
      >
        ≈ {fiatPrice}
        {manifest.fiatCurrency?.currencySymbol}
      </span>
    )
  )
}
