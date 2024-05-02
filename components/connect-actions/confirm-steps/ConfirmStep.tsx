import { useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"

import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { toast } from "@/components/ui/toast/hooks/useToast"

export type ConfirmStepProps = {
  userAddress: string
  onValid: () => void
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({
  userAddress,
  onValid,
}) => {
  const [hasReading, setHasReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { connectComethWallet } = useConnectComethWallet()
  const { setUserIsFullyConnected } = useUserAuthContext()

  const handleConfirmClick = async () => {
    if (hasReading) {
      setIsLoading(true)
      try {
        await connectComethWallet(userAddress)
        setUserIsFullyConnected(true)
        onValid()
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.message || "There was an error connecting your wallet.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      toast({
        title: "Error",
        description: "Please read the tutorial before confirming",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <div className="text-muted-foreground">
        <p className="mb-2">
          Please note that like Cosmik Battle, the Marketplace operates on
          Cometh&apos;s exclusive blockchain, known as &quot;Muster,&quot;. It
          also utilizes its unique Account Abstraction solution, enabling Cometh
          to deploy Smart Wallets for players.
          <br />
          <br />
          In order to make purchases within the marketplace, players must
          possess ETH in their Smart Wallet on the Muster Network. <br />
          <span className="font-semibold">Please visit
          our tutorials for comprehensive guidance on wallet management and
          funds transfer:</span>
        </p>
        <ul className="ml-5 list-disc">
          <li>
            <a
              href="https://www.cosmikbattle.com/cosmik-academy/wallet-management"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-foreground font-medium underline transition-colors"
            >
              Wallet Management
            </a>
          </li>
          <li>
            <a
              href="https://www.cosmikbattle.com/cosmik-academy/marketplace-buyingitems"
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-foreground font-medium underline transition-colors"
            >
              Marketplace Buying Items
            </a>
          </li>
        </ul>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="reading"
          checked={hasReading}
          onCheckedChange={() => setHasReading(!hasReading)}
        />
        <Label htmlFor="reading" className="cursor-pointer leading-tight">
          I have read the tutorial and understand the process to fill my wallet
          with ETH
        </Label>
      </div>
      <Button size="lg" onClick={handleConfirmClick} disabled={!hasReading} isLoading={isLoading}>
        Confirm
      </Button>
    </>
  )
}
