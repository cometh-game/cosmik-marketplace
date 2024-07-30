"use client"

import { useMemo } from "react"
import { useUsernames } from "@/services/cosmik/userService"
import { OrderWithAsset } from "@cometh/marketplace-sdk"

import { DataTable } from "@/components/DataTable"
import { useEchanceActivitiesWithUsernames } from "@/components/trade-activities/activityHooks"

import { useGetBuyOffersColumns } from "./buyOffersColumns"

export type BuyOffersTableProps = {
  offers: OrderWithAsset[]
  isErc1155: boolean
  isSpecificAsset: boolean
}

export function BuyOffersTable({
  offers,
  isErc1155,
  isSpecificAsset,
}: BuyOffersTableProps) {
  const addresses = useMemo(() => {
    const addresses: string[] = []

    offers.forEach((offer) => {
      addresses.push(offer.maker, offer.taker)
    })

    return addresses
  }, [offers])
  const { usernames, isFetchingUsernames } = useUsernames(addresses)

  const offersWithUsernames = useMemo(() => {
    return offers.map((offer) => ({
      ...offer,
      makerUsername: usernames[offer.maker],
    }))
  }, [offers, usernames])

  const columns = useGetBuyOffersColumns(isSpecificAsset, isErc1155)

  return <DataTable columns={columns} data={offersWithUsernames} />
}
