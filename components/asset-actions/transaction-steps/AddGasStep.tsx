import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useIsComethConnectWallet } from "@/providers/authentication/comethConnectHooks"
import {
  fetchHasEnoughGas,
  useHasEnoughGas,
} from "@/services/balance/gasService"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { Button } from "@/components/ui/Button"
import { Price } from "@/components/ui/Price"
import { InfoBox } from "@/components/ui/MessageBox"

export type AddGasStepProps = {
  onValid: () => void
}

export function AddGasStep({ onValid }: AddGasStepProps) {
  const account = useAccount()
  const viewer = account.address
  const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)
  const isComethWallet = useIsComethConnectWallet()
  const { push } = useRouter()

  const { data } = useHasEnoughGas(viewer)

  const checkBalance = async () => {
    setIsRefreshingBalance(true)

    if (!viewer) return
    const { hasEnoughGas } = await fetchHasEnoughGas(viewer, isComethWallet)
    if (hasEnoughGas) {
      onValid()
    }
    setIsRefreshingBalance(false)
  }


  useEffect(() => {
    if (data?.hasEnoughGas === true) {
      return onValid()
    }
  }, [data?.hasEnoughGas, onValid])

  return (
    <div className="flex flex-col items-center justify-center gap-4 pt-8">
      <h3 className="text-xl font-semibold">Top up your wallet</h3>
      <p>
        Looks like you <strong>don&rsquo;t have enough native tokens</strong> to
        pay for transaction gas. Whenever you make a transaction on the
        blockchain, you need to pay a small fee to the miners who process it.
      </p>
      <p>
        Please add{" "}
        <Price
          amount={globalConfig.minimumBalanceForGas}
          isNativeToken={true}
        />{" "}
        to your wallet, and then refresh your balance. Your transactions will
        not cost as much but we need an minimum amount to be sure you can pay
        for gas.
      </p>
      <p>
        Wallet address: <strong>{viewer}</strong>
      </p>
      <InfoBox
        title="Warning"
        description={
          <div className="text-muted-foreground">
            Cosmik Battle is deployed on the Muster and leverages its own
            Account Abstraction solution. Prior to engaging in any
            wallet-related activity, please visit our wallet tutorials.
            <br />
            <br />
            <a
              href="https://www.cosmikbattle.com/cosmik-academy/wallet-management"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-foreground font-medium underline transition-colors"
            >
              Wallet Management
            </a>
            &nbsp;and&nbsp;
            <a
              href="https://www.cosmikbattle.com/cosmik-academy/marketplace-gettingready"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-foreground font-medium underline transition-colors"
            >
              Marketplace Getting Ready
            </a>
          </div>
        }
      />
      <div className="flex gap-4">
        <Button onClick={() => push("/topup")}>
          Fill your wallet
        </Button>
        <Button
          variant="link"
          isLoading={isRefreshingBalance}
          onClick={checkBalance}
          className="px-0"
        >
          Refresh balance
        </Button>
      </div>
    </div>
  )
}
