import { LegendaReward, LegendaRewards } from "./types"

type RewardsListProps = {
  rewards: LegendaRewards
}

const RewardItem = ({ name, count }: LegendaReward) => (
  <div key={name} className="flex gap-x-2">
    <div className="mr-0.5 font-medium">{name}:</div>
    <div className="font-bold">{count}</div>
  </div>
)

export function RewardsList({ rewards }: RewardsListProps) {
  return (
    <div className="w-full space-y-3">
      <div>
        <div className="mb-0.5 font-bold uppercase">
          Cometh Battle NFTs Migrated to core cards in Cosmik Battle:
        </div>
        <div className="max-h-[220px] overflow-y-auto">
          {rewards.cards.map(RewardItem)}
        </div>
      </div>
      <div>
        <div className="mb-0.5 font-bold uppercase">
          Your Rank and Cosmetic Reward:
        </div>
        <div>{rewards.cosmetics.map(RewardItem)}</div>
      </div>
      {rewards.credits > 0 && (
        <div>
          <div className="mb-0.5 font-bold uppercase">
            Galactic Credits Converted
          </div>
          <div className="font-bold">{rewards.credits}</div>
        </div>
      )}
    </div>
  )
}
