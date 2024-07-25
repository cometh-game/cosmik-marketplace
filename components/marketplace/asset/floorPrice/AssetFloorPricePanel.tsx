import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Loader } from "lucide-react"

import { Card, CardContent } from "@/components/ui/Card"

import { AssetFloorPriceDisplay } from "./AssetFloorPriceDisplay"
import {
  useAssetFloorPriceAttributes,
  useFloorPriceAsset,
} from "./FloorPriceHook"

type AssetFloorPriceProps = {
  asset: AssetWithTradeData
}

export default function AssetFloorPricePanel({ asset }: AssetFloorPriceProps) {
  const assetFloorPriceAttributes = useAssetFloorPriceAttributes(asset)

  const { isLoading, floorPriceAsset } = useFloorPriceAsset(asset)

  if (assetFloorPriceAttributes.length === 0) {
    return null
  }

  return (
    <Card className="btn-default bg-primary/20 text-accent before:bg-primary/20 relative mt-4 after:content-none">
      <CardContent className="py-[22px]">
        <div className="">
          <div className="mb-2 font-semibold text-white">Floor price</div>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex grow flex-wrap items-center gap-2">
              {assetFloorPriceAttributes.map((attribute) => (
                <>
                  <span className="font-medium capitalize">
                    {attribute.trait_type}:
                  </span>{" "}
                  <span className="ml-1 font-medium text-white">
                    {attribute.value
                      ? attribute.value.toString()
                      : JSON.stringify(attribute.value)}
                  </span>
                </>
              ))}
            </div>
            <div>
              {isLoading ? (
                <div className="text-center font-medium">
                  <Loader size={16} className="mr-1.5 animate-spin" />
                </div>
              ) : (
                <div className="">
                  <AssetFloorPriceDisplay
                    floorPriceAsset={floorPriceAsset}
                    pageAsset={asset}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
