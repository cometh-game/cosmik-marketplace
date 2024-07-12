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

  console.log("rewards", rewards)

  return (
    <>
      <div className="mb-2">
        <p className="text-muted-foreground">
          The rewards were assigned based on the content of your wallet as of
          <span className="font-semibold">May 29, 2 PM CET</span>. For more
          information about the Legenda Program and your rewards, please visit .
          <a
            href=""
            target="_blank"
            rel="noreferrer"
            className="hover:text-accent-foreground font-medium underline transition-colors"
          >
            XXX
          </a>
          .
        </p>

        <RewardsList rewards={rewards} />
      </div>

      <Button size="lg" onClick={onValid} disabled={isLoadingRewards}>
        Get my rewards
      </Button>
    </>
  )
}
