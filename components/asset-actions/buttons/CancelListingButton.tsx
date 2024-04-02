"use client"

import { useCallback } from "react"
import { useCancelListing } from "@/services/orders/cancelListingService"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { Button } from "@/components/ui/Button"

export type CancelListingButtonProps = {
  asset: AssetWithTradeData,
} & React.ComponentProps<typeof Button>

export function CancelListingButton({ asset, size = "lg" }: CancelListingButtonProps) {
  const { mutateAsync: cancel, isPending } = useCancelListing()

  const onConfirm = useCallback(async () => {
    await cancel(asset)
  }, [asset, cancel])

  return (
    <Button
      className="w-full"
      size={size}
      onClick={onConfirm}
      disabled={isPending}
      isLoading={isPending}
    >
      Cancel Listing
    </Button>
  )
}
