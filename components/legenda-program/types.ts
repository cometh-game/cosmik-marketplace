export type Legenda = {
  userId: string
  address: string
  claimed: boolean
  rewards: LegendaRewards
}

export type LegendaRewards = {
  cards: LegendaReward[]
  credits: number
  cosmetics: LegendaReward[]
}

export type LegendaReward = {
  name: string
  count: number
}