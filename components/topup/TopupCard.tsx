import { useState } from "react"

import globalConfig from "@/config/globalConfig"

import { Button } from "../ui/Button"
import { Input } from "../ui/Input"

type TopupCardProps = {
  price: number
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
          type="number"
          placeholder="Type a custom amount"
          value={price}
          onChange={(e) => onInputChange?.(e.target.value)}
          className="mb-4"
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
