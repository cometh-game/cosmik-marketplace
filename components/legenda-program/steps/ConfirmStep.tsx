import { useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"

import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { toast } from "@/components/ui/toast/hooks/useToast"

import { useClaimRewards } from "../LegendaRewardsHook"

export type ConfirmStepProps = {
  userAddress: string
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ userAddress }) => {
  const [hasReading, setHasReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { connectComethWallet } = useConnectComethWallet()
  const { claimRewards, isClaimingRewards } = useClaimRewards()
  console.log("claimRewards", claimRewards)
  const handleConfirmClick = async () => {
    if (hasReading) {
      setIsLoading(true)
      try {
        // await claimRewards()
        // onValid()
        // CALL onReset ?
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
    }
  }

  return (
    <>
      <div className="text-muted-foreground">
        <p className="mb-2">
          Attention pilot, you are about to confirm your participation in the
          Legenda Program. Please note that you can only redeem rewards
          <span className="font-semibold">
            {" "}
            once per account and per wallet
          </span>
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="reading"
          checked={hasReading}
          onCheckedChange={() => setHasReading(!hasReading)}
        />
        <Label htmlFor="reading" className="cursor-pointer leading-tight">
          I understand that I will not be eligible for other rewards after
          applying to the Legenda Program.
        </Label>
      </div>
      <Button
        size="lg"
        onClick={handleConfirmClick}
        disabled={!hasReading}
        isLoading={isLoading}
      >
        Confirm
      </Button>
    </>
  )
}
