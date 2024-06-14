import { useMemo } from "react"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import { useUsernames } from "@/services/cosmik/userService"
import {
  AssetTransfers,
  Order,
  OrderFilledEventWithAsset,
  SearchFilledEventsRequest,
  SearchOrdersRequest,
} from "@cometh/marketplace-sdk"
import { BigNumber } from "ethers"
import { Address } from "viem"

import { calculateFeesAmount, totalFeesFromCollection } from "@/lib/utils/fees"

import {
  getActivityTimestamp,
  getActivityWallets,
  getMergedActivities,
  isFilledEventActivity,
  isOrderActivity,
  isTransferActivity,
} from "./activityHelper"
import {
  AssetActivity,
  FILLED_EVENT_TYPE,
  ORDER_TYPE,
  TRANSFER_TYPE,
} from "./AssetActivityTypes"

export const useActivityContractAddress = (activity: AssetActivity) => {
  return useMemo(() => {
    if (isOrderActivity(activity)) {
      return activity.order.tokenAddress
    } else if (isTransferActivity(activity)) {
      return activity.transfer.contractAddress
    } else if (isFilledEventActivity(activity)) {
      return activity.filledEvent.tokenAddress
    } else {
      throw new Error("Unknown activity type")
    }
  }, [activity])
}

export const useActivityWalletAddress = (activity: AssetActivity) => {
  return useMemo(() => {
    if (isOrderActivity(activity)) {
      return [activity.order.maker, activity.order.taker]
    } else if (isFilledEventActivity(activity)) {
      return [activity.filledEvent.maker, activity.filledEvent.taker]
    } else if (isTransferActivity(activity)) {
      return [activity.transfer.fromAddress, activity.transfer.toAddress]
    }
  }, [activity])
}

export const useEchanceActivitiesWithUsernames = (
  assetTransfers: AssetTransfers,
  assetOrders: Order[],
  assetFilledEvents: OrderFilledEventWithAsset[],
  maxActivitiesToShow?: number
): { activitiesWithUsernames: AssetActivity[]; isFetching: boolean } => {
  const addresses = useMemo(() => {
    const addresses = new Set<string>()

    assetTransfers.forEach((transfer) => {
      addresses.add(transfer.fromAddress)
      addresses.add(transfer.toAddress)
    })
    assetOrders.forEach((order) => {
      addresses.add(order.maker)
      addresses.add(order.taker)
    })
    assetFilledEvents.forEach((filledEvent) => {
      addresses.add(filledEvent.maker)
      addresses.add(filledEvent.taker)
    })

    return addresses
  }, [assetTransfers, assetOrders, assetFilledEvents])

  const { usernames, isFetchingUsernames } = useUsernames(Array.from(addresses))

  const activities = useMemo(() => {
    const transferActivites = assetTransfers.map((asset) => ({
      activityType: TRANSFER_TYPE,
      transfer: {
        ...asset,
        fromUsername: usernames[asset.fromAddress],
        toUsername: usernames[asset.toAddress],
      },
    }))
    const orderActivities = assetOrders.map((order) => ({
      activityType: ORDER_TYPE,
      order: {
        ...order,
        makerUsername: usernames[order.maker],
        takerUsername: usernames[order.taker],
      },
    }))
    const filledEventActivities = assetFilledEvents.map((filledEvent) => ({
      activityType: FILLED_EVENT_TYPE,
      filledEvent: {
        ...filledEvent,
        makerUsername: usernames[filledEvent.maker],
        takerUsername: usernames[filledEvent.taker],
      },
    }))

    const allActivities = [
      ...transferActivites,
      ...orderActivities,
      ...filledEventActivities,
    ] as AssetActivity[]

    allActivities.sort((activity1, activity2) => {
      const activity1Timestamp = getActivityTimestamp(activity1)
      const activity2Timestamp = getActivityTimestamp(activity2)

      return activity2Timestamp - activity1Timestamp
    })

    return allActivities.slice(0, maxActivitiesToShow)
  }, [
    assetTransfers,
    assetOrders,
    assetFilledEvents,
    maxActivitiesToShow,
    usernames,
  ])

  return {
    activitiesWithUsernames: activities,
    isFetching: isFetchingUsernames,
  }
}

export const useActivityCollection = (activity: AssetActivity) => {
  const activityContractAddress = useActivityContractAddress(activity)
  const { data: collection } = useGetCollection(
    activityContractAddress as Address
  )
  return collection
}

export const useActivityUnitPrice = (activity: AssetActivity) => {
  const collection = useActivityCollection(activity)

  // Hack to compute unit price
  // If collection fees were updated since the filled event happen, this computation will be wrong
  // Filled event don't store the fees, so the indexer should compute them when indexed or version fees
  return useMemo(() => {
    if (!collection || isTransferActivity(activity)) {
      return null
    }

    if (isFilledEventActivity(activity)) {
      const filledEvent = activity.filledEvent
      const fees = collection.collectionFees.map((fee) => {
        return {
          amount: calculateFeesAmount(
            filledEvent.erc20FillAmount,
            fee.feePercentage
          ),
          recipient: fee.recipientAddress,
        }
      })
      const feesSum = totalFeesFromCollection(fees)
      return BigNumber.from(filledEvent.erc20FillAmount)
        .add(feesSum)
        .div(filledEvent.fillAmount)
        .toString()
    } else if (isOrderActivity(activity)) {
      return activity.order.totalUnitPrice
    }
  }, [activity, collection])
}
