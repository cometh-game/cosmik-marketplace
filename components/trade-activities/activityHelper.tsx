"use client"

import {
  TradeDirection,
  TradeStatus,
} from "@cometh/marketplace-sdk"
import { Address, isAddressEqual } from "viem"

import {
  AssetActivity,
  FILLED_EVENT_TYPE,
  FilledEventActivity,
  ORDER_TYPE,
  OrderActivity,
  TRANSFER_TYPE,
  TransferActivity,
} from "./AssetActivityTypes"

export const isTransferActivity = (
  assetActivity: AssetActivity
): assetActivity is TransferActivity => {
  return assetActivity.activityType === TRANSFER_TYPE
}
export const isOrderActivity = (
  assetActivity: AssetActivity
): assetActivity is OrderActivity => {
  return assetActivity.activityType === ORDER_TYPE
}

export const isFilledEventActivity = (
  assetActivity: AssetActivity
): assetActivity is FilledEventActivity => {
  return assetActivity.activityType === FILLED_EVENT_TYPE
}

export const getActivityTimestamp = (assetActivity: AssetActivity) => {
  if (isTransferActivity(assetActivity)) {
    return assetActivity.transfer.timestamp
  } else if (isOrderActivity(assetActivity)) {
    const { order } = assetActivity

    let dateToUse = ""
    if (order.orderStatus === TradeStatus.FILLED) {
      dateToUse = order.lastFilledAt as string
    } else if (order.orderStatus === TradeStatus.OPEN) {
      dateToUse = order.signedAt
    } else {
      dateToUse = order.cancelledAt as string
    }

    return new Date(dateToUse).getTime()
  } else if (isFilledEventActivity(assetActivity)) {
    return new Date(assetActivity.filledEvent.blockTimestamp).getTime()
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getUsername = (
  address: Address,
  viewerAddress?: Address,
  username?: string
) => {
  if (viewerAddress && isAddressEqual(address, viewerAddress)) {
    return "You"
  }

  if (isAddressEqual(address, "0x0000000000000000000000000000000000000000")) {
    return "0x...0"
  }

  return username
}

export const getFormattedUser = (
  address: Address,
  viewerAddress?: Address,
  username?: string
) => {
  return {
    username: getUsername(address, viewerAddress, username),
    address: address,
  }
}

export const getActivityNftOwner = (
  assetActivity: AssetActivity,
  viewerAddress?: Address
) => {
  if (isTransferActivity(assetActivity)) {
    return getFormattedUser(
      assetActivity.transfer.fromAddress as Address,
      viewerAddress,
      assetActivity.transfer.fromUsername
    )
  } else if (isOrderActivity(assetActivity)) {
    return getFormattedUser(
      (assetActivity.order.direction === TradeDirection.SELL
        ? assetActivity.order.maker
        : assetActivity.order.taker) as Address,
      viewerAddress,
      assetActivity.order.direction === TradeDirection.SELL
        ? assetActivity.order.makerUsername
        : assetActivity.order.takerUsername
    )
  } else if (isFilledEventActivity(assetActivity)) {
    return getFormattedUser(
      (assetActivity.filledEvent.direction === TradeDirection.SELL
        ? assetActivity.filledEvent.maker
        : assetActivity.filledEvent.taker) as Address,
      viewerAddress,
      assetActivity.filledEvent.direction === TradeDirection.SELL
        ? assetActivity.filledEvent.makerUsername
        : assetActivity.filledEvent.takerUsername
    )
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getActivityNftReceiver = (
  assetActivity: AssetActivity,
  viewerAddress?: Address
) => {
  if (isTransferActivity(assetActivity)) {
    return getFormattedUser(
      assetActivity.transfer.toAddress as Address,
      viewerAddress,
      assetActivity.transfer.toUsername
    )
  } else if (isOrderActivity(assetActivity)) {
    return getFormattedUser(
      (assetActivity.order.direction === TradeDirection.SELL
        ? assetActivity.order.taker
        : assetActivity.order.maker) as Address,
      viewerAddress,
      assetActivity.order.direction === TradeDirection.SELL
        ? assetActivity.order.takerUsername
        : assetActivity.order.makerUsername
    )
  } else if (isFilledEventActivity(assetActivity)) {
    return getFormattedUser(
      (assetActivity.filledEvent.direction === TradeDirection.SELL
        ? assetActivity.filledEvent.taker
        : assetActivity.filledEvent.maker) as Address,
      viewerAddress,
      assetActivity.filledEvent.direction === TradeDirection.SELL
        ? assetActivity.filledEvent.takerUsername
        : assetActivity.filledEvent.makerUsername
    )
  } else {
    throw new Error("Unknown activity type")
  }
}

export const getActivityId = (assetActivity: AssetActivity) => {
  if (isTransferActivity(assetActivity)) {
    return TRANSFER_TYPE + assetActivity.transfer.id
  } else if (isOrderActivity(assetActivity)) {
    return ORDER_TYPE + assetActivity.order.id
  } else if (isFilledEventActivity(assetActivity)) {
    return FILLED_EVENT_TYPE + assetActivity.filledEvent.id
  } else {
    throw new Error("Unknown activity type")
  }
}
