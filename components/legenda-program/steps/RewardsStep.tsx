"use client"

import React from "react"
import { User } from "@/services/cosmik/signinService"

import { Button } from "@/components/ui/Button"

import { useGetRewards } from "../LegendaRewardsHook"
import { RewardsList } from "../RewardsList"

type RewardsStepProps = {
  user: User
  onValid: () => void
}

export function RewardsStep({ user, onValid }: RewardsStepProps) {
  const { rewards, isLoadingRewards } = useGetRewards()

  return (
    <>
      <h3 className="text-xl font-semibold">Your rewards</h3>
      <p className="mb-3">
        The rewards were assigned based on the content of your wallet as
        of&nbsp;
        <span className="text-accent-foreground font-semibold">
          May 29, 2 PM CET
        </span>
        . For more information about the Legenda Program and your rewards,
        please visit&nbsp;
        <a
          href="www.cosmikbattle.com/cosmik-academy/legenda-program"
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent-foreground font-medium underline transition-colors"
        >
          Legenda Program Workshop
        </a>
        .
      </p>

      {isLoadingRewards ? (
        <p>Loading rewards...</p>
      ) : (
        <RewardsList rewards={rewards} />
      )}

      <div className="mt-2">
        <Button size="lg" onClick={onValid} disabled={isLoadingRewards}>
          Get my rewards
        </Button>
      </div>
    </>
  )
}
