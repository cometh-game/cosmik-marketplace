import { useState } from "react"

import globalConfig from "@/config/globalConfig"
import { Input } from "@/components/ui/Input"

import { Button } from "../ui/Button"

type TopupCardProps = {
  price: string
  currency: string
  nativeCurrencyPrice: number | null
  onInputChange?: (value: string) => void
  onInit: () => void
  isLoading: boolean
  isCustom?: boolean
}

export function TopupCard({
  price,
  nativeCurrencyPrice,
  currency,
  onInputChange,
  onInit,
  isLoading,
  isCustom = false,
}: TopupCardProps) {
  return (
    <div className="card-secondary px-8 pb-8 pt-10 text-center">
      {isCustom ? (
        <Input
          placeholder="Your custom amount"
          inputUpdateCallback={onInputChange}
          className="mb-4"
          min={0}
        />
      ) : (
        <div className="text-6xl font-bold italic tracking-wide text-[#FFD7D9] drop-shadow-[3px_3px_0_rgba(54,14,59,1)]">
          {price}
          <span className="ml-0.5 text-3xl">{currency}</span>
        </div>
      )}
      <div className="text-2xl font-medium tracking-wide text-white/50">
        {nativeCurrencyPrice !== null ? (
          <>
            {`≈ ${nativeCurrencyPrice}` ?? "..."}
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
        onClick={onInit}
        className="mt-3 w-full"
        isLoading={isLoading}
        disabled={isLoading}
      >
        Topup
      </Button>
    </div>
  )
}
