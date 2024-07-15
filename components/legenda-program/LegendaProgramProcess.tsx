import { useEffect } from "react"
import Link from "next/link"
import { User } from "@/services/cosmik/signinService"
import { useAccount, useDisconnect } from "wagmi"

import { useStepper } from "@/lib/utils/stepper"
import { Dialog, DialogContent } from "@/components/ui/Dialog"
import { Case, Switch } from "@/components/utils/Switch"

import { Stepper } from "../ui/Stepper"
import { AddWalletStep } from "./steps/AddWalletStep"
import { ConfirmStep } from "./steps/ConfirmStep"
import { RewardsStep } from "./steps/RewardsStep"

const legendaProgramSteps = [
  { label: "Add wallet", value: "add-wallet" },
  { label: "Preview your rewards", value: "claim-rewards" },
  {
    label: `Confirm`,
    value: "confirm",
  },
]

type LegendaProgramProcessProps = {
  user: User
}

export function LegendaProgramProcess({ user }: LegendaProgramProcessProps) {
  const { currentStep, nextStep } = useStepper({
    steps: legendaProgramSteps,
  })
  const { disconnectAsync } = useDisconnect()
  const { address: walletAddress } = useAccount()

  useEffect(() => {
    // disconnect wallet if user is already connected
    if (walletAddress) {
      disconnectAsync()
    }
  }, [])

  if (!currentStep || !user) return null

  return (
    <Dialog open={true}>
      <DialogContent shouldDisplayOverlay={false} shouldDisplayCloseBtn={false}>
        <Stepper value={currentStep.value} steps={legendaProgramSteps} />
        <div className="flex flex-col items-center justify-center gap-4 pt-8">
          <Switch value={currentStep.value}>
            <Case value="add-wallet">
              <AddWalletStep user={user} onValid={nextStep} />
            </Case>
            <Case value="claim-rewards">
              <RewardsStep user={user} onValid={nextStep} />
            </Case>
            <Case value="confirm">
              <ConfirmStep userAddress={user.address} />
            </Case>
          </Switch>

          <Link href="/nfts" className="mt-2">
            Back to marketplace
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  )
}
