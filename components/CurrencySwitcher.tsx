"use client"

import { Label } from "@/components/ui/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select"

type CurrencySwitcherProps = {
  currency: string
  onCurrencyChange: (value: string) => void
}

export function CurrencySwitcher({
  currency,
  onCurrencyChange,
}: CurrencySwitcherProps) {
  return (
    <div className="flex items-center gap-x-2">
      <Label htmlFor="make-buy-offer-price">Choose your currency :</Label>
      <Select
        defaultValue={currency}
        value={currency}
        onValueChange={(v) => onCurrencyChange(v)}
      >
        <SelectTrigger className="text-accent-foreground border-0 font-semibold md:w-[120px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD" className="font-semibold">
            Dollar ($)
          </SelectItem>
          <SelectItem value="EUR" className="font-semibold">
            Euro (€)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
