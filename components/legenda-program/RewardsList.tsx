import { LegendaReward } from "./types"

type RewardsListProps = {
  rewards: LegendaReward[]
}

export function RewardsList({ rewards }: RewardsListProps) {
  return (
    <div>
      {rewards.map((reward) => (
        <div key={reward.type}>{reward.type}</div>
      ))}
    </div>
  )
}
