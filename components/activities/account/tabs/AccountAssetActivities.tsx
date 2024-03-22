"use client"

import { useMemo } from "react"
import {
  useAssetReceivedOffers,
  useAssetSentOffers,
} from "@/services/orders/asset-buy-offers"
import { Address } from "viem"

import { useCurrentViewerAddress } from "@/lib/web3/auth"

import { Tabs } from "../../../ui/Tabs"
import { TabBar } from "./TabBar"
import { AssetsSearchTabContent } from "./tabs-content/AssetsSearchTabContent"
import { BuyOffersTabContent } from "./tabs-content/BuyOffersTabContent"
import { SendBuyOffersTabContent } from "./tabs-content/SendBuyOffersTabContent"

export type AccountAssetActivitiesProps = {
  walletAddress: Address
  children?: React.ReactNode
}

export const AccountAssetActivities = ({
  walletAddress,
  children,
}: AccountAssetActivitiesProps) => {
  const viewerAddress = useCurrentViewerAddress()
  const owner = useMemo(() => {
    return walletAddress === viewerAddress
  }, [viewerAddress, walletAddress])

  const receivedOffers = useAssetReceivedOffers({ owner: walletAddress })
  const sentOffers = useAssetSentOffers({ owner: walletAddress })

  return (
    <Tabs defaultValue="search-assets" className="w-full ">
      <TabBar
        receivedCounter={receivedOffers.length}
        sentCounter={sentOffers.length}
        owner={owner}
      />
      <AssetsSearchTabContent>{children}</AssetsSearchTabContent>
      <BuyOffersTabContent offers={receivedOffers} />
      <SendBuyOffersTabContent offers={sentOffers} />
    </Tabs>
  )
}
