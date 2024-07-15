import { useMemo, useState } from "react"

import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Switch } from "@/components/ui/Switch"
import { toast } from "@/components/ui/toast/hooks/useToast"

import { useClaimRewards, useGetStatus } from "../LegendaRewardsHook"

export type ConfirmStepProps = {
  userAddress: string
}

export const ConfirmStep: React.FC<ConfirmStepProps> = ({ userAddress }) => {
  const [hasReading, setHasReading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { claimRewards, claimedRewards } = useClaimRewards()
  const { status: hasClaimedRewards, isLoadingStatus } = useGetStatus()
  console.log("claimRewards", claimRewards)

  const hasRewardsError = useMemo(() => {
    return (
      claimedRewards?.filter((item: any) => item.success === false).length > 0
    )
  }, [claimedRewards])

  const handleConfirmClick = async () => {
    if (hasReading) {
      setIsLoading(true)
      try {
        const result = await claimRewards()
        console.log("result", result)
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
      {hasClaimedRewards ? (
        <>
          <h3 className="text-xl font-semibold">
            Your rewards have been successfully claimed!
          </h3>
          {hasRewardsError && (
            <p>
              However, we detected some errors during the retrieval of your
              rewards. Please contact support.
            </p>
          )}
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold">Confirm your participation</h3>
          <p>
            Attention pilot, you are about to confirm your participation in the
            Legenda Program. Please note that you can only redeem rewards
            <span className="font-semibold">
              {" "}
              once per account and per wallet
            </span>
          </p>
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

          <div className="mt-2">
            <Button
              size="lg"
              onClick={handleConfirmClick}
              disabled={!hasReading || isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Claiming..." : "Yes, I confirm my participation"}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
