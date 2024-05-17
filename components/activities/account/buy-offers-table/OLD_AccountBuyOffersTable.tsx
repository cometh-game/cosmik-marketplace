// "use client"

// import { useMemo } from "react"
// import { useUsernames } from "@/services/cosmik/userService"
// import { Address, isAddressEqual } from "viem"
// import { useAccount } from "wagmi"

// import { BuyOffer } from "@/types/buy-offers"
// import { DataTable } from "@/components/DataTable"

// import { columns } from "./columns"

// export type AccountBuyOffersTableProps = {
//   offers: BuyOffer[]
// }

// export function AccountBuyOffersTable({ offers }: AccountBuyOffersTableProps) {
//   const account = useAccount()
//   const viewerAddress = account.address

//   const addresses = useMemo(() => {
//     return Array.from(
//       new Set(
//         offers.flatMap((offer) => [offer.emitter.address, offer.owner.address])
//       )
//     )
//   }, [offers])

//   const { usernames, isFetchingUsernames } = useUsernames(addresses)

//   const data = useMemo(() => {
//     return offers
//       .filter((offer) => {
//         if (!viewerAddress) return true
//         if (
//           isAddressEqual(offer.emitter.address, viewerAddress) &&
//           isAddressEqual(offer.owner.address, viewerAddress)
//         )
//           return false
//         return true
//       })
//       .sort((a, b) => {
//         const dateA = new Date(a.date.valueOf())
//         const dateB = new Date(b.date.valueOf())
//         if (dateA > dateB) return -1
//         if (dateA < dateB) return 1
//         return 0
//       })
//       .map((offer) => {
//         const emitterUsername = usernames[offer.emitter.address]
//         const ownerUsername = usernames[offer.owner.address]

//         return {
//           ...offer,
//           emitter: {
//             ...offer.emitter,
//             username: emitterUsername,
//           },
//           owner: {
//             ...offer.owner,
//             username: ownerUsername,
//           },
//         }
//       })
//   }, [offers, viewerAddress, usernames])

//   return <DataTable columns={columns} data={data} />
// }
