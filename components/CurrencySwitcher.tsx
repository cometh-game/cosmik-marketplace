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
      {/* <p>Choose your currency :</p> */}
      <Label htmlFor="make-buy-offer-price">Choose your currency :</Label>
      <Select defaultValue={currency} onValueChange={(v) => onCurrencyChange(v)}>
        <SelectTrigger className="md:w-[120px]">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">Dollar ($)</SelectItem>
          <SelectItem value="EUR">Euro (€)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
