"use client"

import { useAssetReceivedOffers } from "@/services/orders/assetOffersService"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { TabsContent } from "@/components/ui/Tabs"
import { BuyOffersTable } from "@/components/activities/asset-details/OLD_buy-offers-table/OLD_BuyOffersTable"

export type ActivitiesBuyOffersTabContentProps =
  | {
      asset: AssetWithTradeData
    }
  | {
      maker: Address
    }

export const BuyOffersTabContent = (
  props: ActivitiesBuyOffersTabContentProps
) => {
  const offers = useAssetReceivedOffers(props)

  return (
    <TabsContent value="buy-offers" className="w-full">
      <BuyOffersTable offers={offers} />
    </TabsContent>
  )
}
