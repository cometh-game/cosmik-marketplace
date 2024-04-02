"use client"

type CurrencySwitcherProps = {
  currency: string
  onCurrencyChange: (value: string) => void
}

export function CurrencySwitcher({
  currency,
  onCurrencyChange,
}: CurrencySwitcherProps) {
  return (
    <div className="flex h-[40px] w-[80px] rounded-sm border border-white/5">
      <button
        type="button"
        onClick={() => onCurrencyChange("USD")}
        className={`flex-1 font-semibold ${currency === "USD" ? "text-accent-foreground bg-white/10" : ""}`}
      >
        $
      </button>
      <button
        type="button"
        onClick={() => onCurrencyChange("EUR")}
        className={`flex-1 font-semibold ${currency === "EUR" ? "text-accent-foreground bg-white/10" : ""}`}
      >
        €
      </button>
    </div>
  )
}
