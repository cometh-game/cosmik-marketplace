"use client"

import { useMemo } from "react"
import { BigNumber } from "ethers"
import { Address, isAddressEqual } from "viem"

import { BuyOffer } from "@/types/buy-offers"
import { useAccount } from "wagmi"
import { DataTable } from "@/components/DataTable"

import { columns } from "./columns"
import { useUsernames } from "@/services/cosmik/userService"

export type BuyOffersTableProps = {
  offers: BuyOffer[]
}

export function BuyOffersTable({ offers }: BuyOffersTableProps) {
  const account = useAccount()
  const viewerAddress = account.address

  const addresses = useMemo(() => {
    return Array.from(
      new Set(
        offers.flatMap((offer) => [offer.emitter.address, offer.owner.address])
      )
    )
  }, [offers])

  const { usernames } = useUsernames(addresses)

  const data = useMemo(() => {
    return offers
      .filter((offer) => {
        if (offer.trade.tokenId !== offer.asset?.tokenId) return false
        if (
          viewerAddress &&
          isAddressEqual(offer.emitter.address, viewerAddress) &&
          isAddressEqual(
            (offer.asset?.owner as Address) ?? offer.owner.address,
            viewerAddress
          )
        )
          return false
        return true
      })
      .sort((a, b) => {
        const [bigA, bigB] = [
          BigNumber.from(a.amount),
          BigNumber.from(b.amount),
        ]
        if (bigA.gt(bigB)) return -1
        if (bigA.lt(bigB)) return 1
        return 0
      })
      .map((offer) => {
        const emitterUsername = usernames[offer.emitter.address]
        const ownerUsername = usernames[offer.owner.address]

        return {
          ...offer,
          emitter: {
            ...offer.emitter,
            username: emitterUsername,
          },
          owner: {
            ...offer.owner,
            username: ownerUsername,
          },
        }
      })
  }, [offers, viewerAddress])

  return <DataTable columns={columns} data={data} />
}