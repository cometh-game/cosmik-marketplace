import { useState } from "react"
import Image from "next/image"
import { useBalance } from "@/services/balance/fundsService"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { Separator } from "@/components/ui/Separator"

import { WrapButton } from "../asset-actions/buttons/WrapButton"

export function AccountBalance() {
  const balance = useBalance()
  const [isUnwrap, setIsUnwrap] = useState(false)
  return (
    <>
      <div className="mb-3 space-y-3 rounded-md border border-accent/10 p-3">
        <div className="flex flex-col gap-2">
          <AccountBalanceLine
            balance={balance.native}
            currency={globalConfig.network.nativeToken.symbol}
            logo={globalConfig.network.nativeToken.thumb}
          />
          <Separator className="bg-accent/10" />
          <AccountBalanceLine
            balance={
              globalConfig.useNativeForOrders ? balance.wrapped : balance.ERC20
            }
            currency={globalConfig.ordersErc20.symbol}
            logo={globalConfig.ordersErc20.thumb}
          />
        </div>
      </div>

      {globalConfig.useNativeForOrders && (
        <div className="grid">
          <WrapButton
            isUnwrap={isUnwrap}
            onToggleMode={() => setIsUnwrap(!isUnwrap)}
          />
        </div>
      )}
    </>
  )
}

type AccountBalanceLineProps = {
  balance: string
  currency: string
  logo?: string | { native: string; wrapped: string }
}

export function AccountBalanceLine({
  balance,
  currency,
  logo,
}: AccountBalanceLineProps) {
  const logoSrc = typeof logo === 'string' ? logo : logo?.native || logo?.wrapped;

  return (
    <div className="inline-flex items-center gap-1.5">
      {logo && (
        <div className="rounded-full bg-secondary">
          <Image
            src={`${env.NEXT_PUBLIC_BASE_PATH}/tokens/${logoSrc}`}
            alt=""
            width={20}
            height={20}
          />
        </div>
      )}
      <span className="text-[15px] font-semibold">
        {balance} {currency}
      </span>
    </div>
  )
}
