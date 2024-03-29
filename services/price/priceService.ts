import { useMemo } from "react"
// import i18nConfig from "@/i18nConfig"
import { manifest } from "@/manifests/manifests"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCurrentLocale } from "next-i18n-router/client"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"

const coinId = globalConfig.coinGeckoId?.toLowerCase()
const fiatCurrencyId = manifest.fiatCurrency?.currencyId

const useTokenFiatPrice = ({
  currency = "usd",
}: { currency?: string } = {}) => {
  return useQuery({
    queryKey: ["fiat-price"],
    queryFn: async () => {
      if (!coinId) {
        throw new Error("erc20.id is not defined in the manifest")
      }

      if (!fiatCurrencyId || !fiatCurrencyId) {
        throw new Error("currencySymbol is not defined in the manifest")
      }

      const currencies = fiatCurrencyId.join(",")

      const res = await axios.get(
        `${env.NEXT_PUBLIC_BASE_PATH}/api/fiat-currency-price?id=${coinId}&currency=${currencies}`
      )
      const price = res.data.currentFiatPrice[coinId][currency]
      console.log("price", price)
      return price
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
  })
}

export const useConvertPriceToFiat = (
  amount: number | null,
  locale?: string,
  decimals: number = 2
) => {
  const currency = locale === "en" ? "usd" : "eur"
  const { data: price } = useTokenFiatPrice({ currency })

  return useMemo(() => {
    if (!manifest.fiatCurrency.enable) {
      return null
    }
    if (!amount || isNaN(amount) || !price || price === 0) {
      return null
    }
    const fiatPrice = amount / price
    if (!decimals) {
      return Math.round(fiatPrice * 100) / 100
    }
    return Number(fiatPrice.toFixed(decimals))
  }, [amount, price, decimals])
}
