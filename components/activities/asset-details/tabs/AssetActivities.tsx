import {
  AssetTransfers,
  AssetWithTradeData,
  Order,
} from "@cometh/marketplace-sdk"

import { AssetMetadata } from "@/components/marketplace/asset/AssetMetadata"

import { Tabs } from "../../../ui/Tabs"
import { TabBar } from "./TabBar"
import { BuyOffersTabContent } from "./tabs-content/BuyOffersTabContent"
import { ActivitiesTransfersTabContent } from "./tabs-content/ActivitiesTransfersTabContent"

export type AssetActivitiesProps = {
  asset: AssetWithTradeData
  assetTransfers: AssetTransfers
  assetOrders: Order[]
}

export const AssetActivities = ({
  asset,
  assetTransfers,
  assetOrders,
}: AssetActivitiesProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabBar />
      <AssetMetadata asset={asset} />
      <ActivitiesTransfersTabContent
        assetTransfers={assetTransfers}
        assetOrders={assetOrders}
      />
      <BuyOffersTabContent asset={asset} />
    </Tabs>
  )
}
