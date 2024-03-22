import { BuyOffer } from "@/types/buy-offers"
import { useAcceptBuyOfferAssetButton } from "@/lib/web3/flows/"
import { TransactionDialogButton } from "@/components/dialog-button"
import { Case, Switch } from "@/components/utils/Switch"

import { CollectionApprovalStep } from "../transaction-steps/CollectionApprovalStep"
import { ConfirmAcceptBuyOfferStep } from "../transaction-steps/ConfirmAcceptBuyOfferStep"
import { AddGasStep } from "../transaction-steps/AddGasStep"
import { useState } from "react"

export type AcceptBuyOfferButtonProps = {
  offer: BuyOffer
}

export function AcceptBuyOfferButton({ offer }: AcceptBuyOfferButtonProps) {
  const { requiredSteps, isLoading, currentStep, nextStep, reset } =
    useAcceptBuyOfferAssetButton({ offer })
  const [open, setOpen] = useState(false)

  if (!requiredSteps?.length || !currentStep) return null

  const closeDialog = () => {
    setOpen(false)
  }

  if (!requiredSteps?.length || !currentStep) return null

  return (
    <TransactionDialogButton
      label="Accept"
      open={open}
      onOpenChange={setOpen}
      currentStep={currentStep}
      steps={requiredSteps}
      onClose={reset}
      isVariantLink={true}
      isLoading={isLoading}
      isDisabled={isLoading}
    >
      <Switch value={currentStep.value}>
        <Case value="add-gas">
          <AddGasStep onValid={nextStep} />
        </Case>
        <Case value="token-approval">
          <CollectionApprovalStep
            asset={offer.asset! || offer.trade}
            onValid={nextStep}
          />
        </Case>
        <Case value="confirm-accept-buy-offer">
          <ConfirmAcceptBuyOfferStep offer={offer} onValid={closeDialog} />
        </Case>
      </Switch>
    </TransactionDialogButton>
  )
}
