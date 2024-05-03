import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Loader } from "lucide-react"

import { Button } from "@/components/ui/Button"
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

  console.log("assetFloorPriceAttributes", assetFloorPriceAttributes)
  console.log("floorPriceAsset", floorPriceAsset)

  if (assetFloorPriceAttributes.length === 0) {
    return null
  }

  return (
    <Card className="btn-default bg-primary/20 text-accent before:bg-primary/20 relative mt-4 after:content-none">
      <CardContent className="py-[22px]">
        <div className="">
          <div className="mb-2 font-semibold">Floor price:</div>
          <div className="flex gap-4">
            <div className="flex grow flex-wrap gap-2">
              {assetFloorPriceAttributes.map((attribute) => (
                <Button
                  key={attribute.trait_type}
                  variant="secondary"
                  size="sm"
                  className="text-sm"
                >
                  <span className="text-foreground/60 font-medium">
                    {attribute.trait_type}:
                  </span>{" "}
                  <span className="ml-1 font-medium  text-white">
                    {attribute.value
                      ? attribute.value.toString()
                      : JSON.stringify(attribute.value)}
                  </span>
                </Button>
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
