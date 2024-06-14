"use client"

import {
  AssetTransfer,
  OrderFilledEventWithAsset,
  OrderWithAsset,
} from "@cometh/marketplace-sdk"

export const TRANSFER_TYPE = "transfer"
export const ORDER_TYPE = "order"
export const FILLED_EVENT_TYPE = "filledEvent"

export type TransferActivity = {
  activityType: "transfer"
  transfer: AssetTransfer & {
    fromUsername: string
    toUsername: string
  }
}

export type Usernames = {
  makerUsername: string
  takerUsername: string
}

export type OrderActivity = {
  activityType: "order"
  order: OrderWithAsset & Usernames
}

export type FilledEventActivity = {
  activityType: "filledEvent"
  filledEvent: OrderFilledEventWithAsset & Usernames
}

export type AssetActivity =
  | TransferActivity
  | OrderActivity
  | FilledEventActivity
