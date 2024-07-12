import { User } from "@/services/cosmik/signinService"

import { useStepper } from "@/lib/utils/stepper"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Case, Switch } from "@/components/utils/Switch"

import { ConfirmStep } from "../confirm-steps/ConfirmStep"
import { RefreshStep } from "../confirm-steps/RefreshStep"
import { RequestAuthorizationStep } from "../confirm-steps/RequestAuthorizationStep"

const authorizationSteps = [
  { label: "Request for Items Authorization", value: "request-authorization" },
  { label: "Access Authorization", value: "refresh" },
  {
    label: `Attention, Pilot! Prepare for entry into the Cosmik Marketplace.`,
    value: "confirm",
  },
]

export type AuthorizationProcessProps = {
  isOpen: boolean
  onClose: () => void
  user: User
}

export function AuthorizationProcess({
  isOpen,
  onClose,
  user,
}: AuthorizationProcessProps) {
  const { currentStep, nextStep } = useStepper({
    steps: authorizationSteps,
  })

  if (!currentStep || !user) return null

  return (
    <Dialog open={isOpen}>
      <DialogContent shouldDisplayCloseBtn={false}>
        <DialogHeader>
          <DialogTitle
            className={
              currentStep === authorizationSteps[authorizationSteps.length - 1]
                ? "!normal-case leading-tight"
                : ""
            }
          >
            {currentStep.label}
          </DialogTitle>
        </DialogHeader>
        <Switch value={currentStep.value}>
          <Case value="request-authorization">
            <RequestAuthorizationStep user={user} onValid={nextStep} />
          </Case>
          <Case value="refresh">
            <RefreshStep user={user} onValid={nextStep} />
          </Case>
          <Case value="confirm">
            <ConfirmStep userAddress={user.address} onValid={onClose} />
          </Case>
        </Switch>
      </DialogContent>
    </Dialog>
  )
}
