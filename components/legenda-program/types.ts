export type Legenda = {
  userId: string
    address: string
  claimed: boolean
  rewards: LegendaReward[]
}

export type LegendaReward = {
  type: string
  value: string
}