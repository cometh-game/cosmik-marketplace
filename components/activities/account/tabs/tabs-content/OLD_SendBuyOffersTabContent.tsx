"use client"

import { BuyOffer } from "@/types/buy-offers"
import { TabsContent } from "@/components/ui/Tabs"
import { AccountBuyOffersTable } from "@/components/activities/account/buy-offers-table/OLD_AccountBuyOffersTable"

export const SendBuyOffersTabContent = ({ offers }: { offers: BuyOffer[] }) => {
  return (
    <TabsContent value="sent-offers" className="w-full">
      <AccountBuyOffersTable offers={offers} />
    </TabsContent>
  )
}
