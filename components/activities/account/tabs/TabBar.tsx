import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { InboxIcon, SendIcon, WalletIcon } from "lucide-react"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { TabsList, TabsTrigger } from "@/components/ui/Tabs"


type TabBarProps = {
  receivedCounter: number
  sentCounter: number
  owner?: boolean
}
const COLLECTION_TAB_PREFIX = "collection-"

const CollectionTabsTrigger = ({ collectionAddress }: {
  collectionAddress: Address
}) => {
  const { data: collection } = useGetCollection(collectionAddress)
  const { switchCollection } = useCurrentCollectionContext()
  return (
    <TabsTrigger
      onClick={() => switchCollection(collectionAddress)}
      value={COLLECTION_TAB_PREFIX + collectionAddress}
    >
      <WalletIcon size="18" className="mr-2" />{" "}
      {collection ? collection.name : collectionAddress}
    </TabsTrigger>
  )

  // return (
  //   <TabsList className="mb-4 h-auto gap-x-8 text-xl sm:mb-8">
  //     <TabsTrigger value="search-assets">
  //       <WalletIcon size="18" className="mr-2" /> {owner ? "My Collectibles" : "Collectibles"}
  //     </TabsTrigger>
  //     <TabsTrigger value="received-offers">
  //       <InboxIcon size="18" className="mr-2" /> Received Offers <small className="ml-1">(
  //       {receivedCounter})</small>
  //     </TabsTrigger>
  //     <TabsTrigger value="sent-offers">
  //       <SendIcon size="18" className="mr-2" /> Sent Offers <small className="ml-1">({sentCounter})</small>
  //     </TabsTrigger>
  //   </TabsList>
  // )
}

export const TabBar = ({ receivedCounter, sentCounter, owner }: TabBarProps) => {
  return (
    <TabsList className="mb-4 h-auto gap-x-6 overflow-x-auto text-xl sm:mb-8">
      {globalConfig.contractAddresses.map((address) => (
        <CollectionTabsTrigger key={address} collectionAddress={address} />
      ))}
      <TabsTrigger value="received-offers">
        <InboxIcon size="18" className="mr-2" /> Received Offers (
        {receivedCounter})
      </TabsTrigger>
      <TabsTrigger value="sent-offers">
        <SendIcon size="18" className="mr-2" /> Sent Offers ({sentCounter})
      </TabsTrigger>
    </TabsList>
  )
}