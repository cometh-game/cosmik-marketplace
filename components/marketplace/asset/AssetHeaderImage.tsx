import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useIsViewerAnOwner } from "@/services/cometh-marketplace/assetOwners"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"

import { OrderAsset } from "@/types/assets"
import { cn } from "@/lib/utils/utils"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { AssetImage } from "@/components/ui/AssetImage"

export const AssetHeaderImage = ({
  asset,
}: {
  asset: SearchAssetWithTradeData | AssetWithTradeData | OrderAsset
}) => {
  const isViewerAnOwner = useIsViewerAnOwner(asset)

  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { data: collection } = useGetCollection(currentCollectionAddress)
  const isCardbacks = collection?.name === "Cardbacks"

  if (
    !asset.cachedImageUrl &&
    !asset.metadata.image &&
    !asset.metadata.image_data
  ) {
    return null
  }

  return (
    <div
      className={cn(
        "btn-default text-accent relative w-full overflow-hidden before:bg-transparent after:content-none lg:w-[55%]",
        isViewerAnOwner ? "bg-[#f4f2e8]" : "bg-primary/20"
      )}
    >
      <AspectRatio ratio={1}>
        <div className="relative flex size-full items-center justify-center">
          <AssetImage
            src={asset.cachedImageUrl}
            fallback={asset.metadata.image}
            imageData={asset.metadata.image_data}
            height={879}
            width={560}
            className={cn("size-full rounded-xl object-contain p-[3.5%]", {
              "p-[10%]": isCardbacks,
            })}
          />
        </div>
      </AspectRatio>
    </div>
  )
}
