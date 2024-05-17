"use client"

import { AssetTransfers, Order } from "@cometh/marketplace-sdk"

import { Card } from "@/components/ui/Card"
import { TabsContent } from "@/components/ui/Tabs"
import { TransfersList } from "@/components/transfers/OLD_TransfersList"

type ActivitiesTransfersTabContentProps = {
  assetTransfers: AssetTransfers
  assetOrders: Order[]
}

export const ActivitiesTransfersTabContent = ({
  assetTransfers,
  assetOrders
}: ActivitiesTransfersTabContentProps) => {
  return (
    <TabsContent value="activity">
      <TransfersList assetTransfers={assetTransfers} assetOrders={assetOrders} />
    </TabsContent>
  )
}
