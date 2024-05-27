"use client"

import { useMemo } from "react"
import Link from "next/link"
import { manifest } from "@/manifests/manifests"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import {
  useAssetOwnedQuantity,
  useIsViewerAnOwner,
} from "@/services/cometh-marketplace/assetOwners"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import {
  AssetAttribute,
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { animated, config, useSpring } from "react-spring"
import { useBoolean } from "usehooks-ts"
import { Address } from "viem"

import globalConfig from "@/config/globalConfig"
import { getRandomArrayElement } from "@/lib/utils/arrays"
import { getAssetColor } from "@/lib/utils/colorsAttributes"
import { cn } from "@/lib/utils/utils"
import { Appear } from "@/components/ui/Appear"
import { AssetImage } from "@/components/ui/AssetImage"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Price } from "@/components/ui/Price"
import { BuyAssetButton } from "@/components/asset-actions/buttons/BuyAssetButton"
import { CancelListingButton } from "@/components/asset-actions/buttons/CancelListingButton"
import { MakeBuyOfferButton } from "@/components/asset-actions/buttons/MakeBuyOfferPriceDialog"
import { SellAssetButton } from "@/components/asset-actions/buttons/SellAssetButton"
import { SwitchNetwork } from "@/components/asset-actions/buttons/SwitchNetwork"
import { AuthenticationButton } from "@/components/AuthenticationButton"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantity from "@/components/erc1155/TokenQuantity"

export type AssetCardProps = {
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  }
  children?: React.ReactNode | React.ReactNode[]
}

export type AssetCardBaseProps = {
  src?: string | null
  isViewerAnOwner: boolean
  isCardbacksAsset: boolean
  children?: React.ReactNode | React.ReactNode[]
  fallback?: string | null
  asset: SearchAssetWithTradeData
}

export type AssetImageContainerProps = {
  children?: React.ReactNode | React.ReactNode[]
  color?: string | null
  className?: string
  isHovered?: boolean
  imageAspectRatio?: number
}

export function AssetImageContainer({
  children,
  color,
  className,
  isHovered,
  imageAspectRatio: imageAspectRatio,
}: AssetImageContainerProps) {
  const style = useSpring({
    to: {
      transform: isHovered
        ? `rotateX(2deg) translateY(-8px) scale(${1.01})`
        : "rotateX(0deg) translateY(0px) scale(1)",
    },
    config: config.gentle,
  })

  return (
    <animated.div className="z-10" style={style}>
      <div
        className={cn(
          "relative h-auto w-[84px] overflow-hidden rounded-md max-sm:rounded-md sm:h-[380px] sm:w-full",
          className
        )}
      >
        {children}
      </div>
    </animated.div>
  )
}

export function AssetCardBase({
  src,
  fallback,
  children,
  isViewerAnOwner,
  isCardbacksAsset,
  asset,
}: AssetCardBaseProps) {
  const isHovered = useBoolean(false)
  const imageAspectRatio =
    globalConfig.collectionSettingsByAddress[
      asset.contractAddress.toLowerCase() as Address
    ].imageAspectRatio
  const isErc1155 = useAssetIs1155(asset)
  const assetOwnedQuantity = useAssetOwnedQuantity(asset)

  const cardTextHeightsClass = manifest.fiatCurrency.enable
    ? "sm:h-[110px]"
    : "sm:h-[100px]"

  return (
    <Appear
      enabled={false}
      condition={true}
      delay={getRandomArrayElement([0, 25, 50, 75, 100])}
      className="relative w-full justify-self-center"
    >
      <Card
        onMouseEnter={isHovered.setTrue}
        onMouseLeave={isHovered.setFalse}
        className={cn(
          "card-ghost flex size-full flex-1 flex-row items-center border-transparent p-2 pr-4 shadow-none transition-all duration-200 ease-in-out sm:inline-flex sm:flex-col sm:items-start sm:border-2 sm:p-0",
          isHovered.value && "shadow-md",
          isViewerAnOwner && "bg-[#f4f2e8]/[.02]"
        )}
      >
        <div className="relative sm:w-full">
          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(isHovered.value && "brightness-90", "block h-full")}
          >
            <AssetImageContainer
              color={getAssetColor(asset)}
              isHovered={isHovered.value}
              imageAspectRatio={imageAspectRatio}
            >
              <AssetImage
                src={src}
                fallback={fallback}
                imageData={asset.metadata.image_data}
                height={380}
                width={320}
                className={cn("z-20 size-full rounded-lg object-contain", {
                  "": isCardbacksAsset,
                })}
              />
            </AssetImageContainer>
          </Link>

          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              !isErc1155 && "hidden",
              "bg-foreground/20 text-background absolute left-2 top-2 rounded-lg px-3 py-1 text-sm font-semibold"
            )}
          >
            <TokenQuantity value={asset.supply} />
          </Link>

          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              (!isErc1155 || !assetOwnedQuantity) && "hidden",
              "bg-foreground/20 text-background border-owner absolute right-2 top-2 rounded-lg border px-3 py-1 text-sm font-semibold"
            )}
          >
            Owned: <TokenQuantity value={assetOwnedQuantity} />
          </Link>

          <div
            className={cn(
              !isHovered.value && "hidden",
              "absolute bottom-4 left-1/2 -translate-x-1/2"
            )}
          >
            {/* {renderAssetActions(asset, isOwnerAsset)} */}
            <AssetActions asset={asset} isViewerAnOwner={isViewerAnOwner} />
          </div>
        </div>

        <div className={cn("h-full sm:w-full")}>
          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn("flex h-full flex-nowrap font-medium text-white ")}
          >
            <div className="flex w-full flex-col justify-center pl-2 sm:p-5 ">
              <div>{children}</div>
            </div>
          </Link>
        </div>
      </Card>
    </Appear>
  )
}

function AssetListingsButton({ asset }: { asset: SearchAssetWithTradeData }) {
  return (
    <Link
      href={`/nfts/${asset.contractAddress}/${asset.tokenId}?tab=listings#tabs`}
    >
      <Button className="w-full" size="lg">
        Listings
      </Button>
    </Link>
  )
}

function AssetActions({
  asset,
  isViewerAnOwner,
}: {
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  }
  isViewerAnOwner: boolean
}) {
  const isAsset1155 = useAssetIs1155(asset)

  let button = undefined
  let buttonText = ""
  if (asset.orderbookStats.lowestListingPrice && !isViewerAnOwner) {
    buttonText = "Buy now "
    if (!isAsset1155) {
      button = <BuyAssetButton asset={asset} />
    } else {
      button = <AssetListingsButton asset={asset} />
    }
  } else if (!isViewerAnOwner) {
    button = <MakeBuyOfferButton asset={asset} />
    buttonText = "Make an offer"
  } else if (!asset.orderbookStats.lowestListingPrice || isAsset1155) {
    if (isAsset1155 && asset.orderbookStats.lowestListingPrice) {
      button = (
        <div className="flex flex-col items-center justify-center gap-2">
          <SellAssetButton asset={asset} />
          <AssetListingsButton asset={asset} />
        </div>
      )
    } else {
      button = <SellAssetButton asset={asset} />
      buttonText = "Sell now"
    }
  } else {
    button = <CancelListingButton asset={asset} />
    buttonText = "Cancel listing"
  }

  if (button) {
    return (
      <div className="hidden sm:block">
        <AuthenticationButton customText={buttonText} hideIcon={true}>
          <SwitchNetwork>{button}</SwitchNetwork>
        </AuthenticationButton>
      </div>
    )
  }
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const isViewerAnOwner = useIsViewerAnOwner(asset)
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { data: collection } = useGetCollection(currentCollectionAddress)
  const isCardbacks = collection?.name === "Cardbacks"

  return (
    <AssetCardBase
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      isViewerAnOwner={isViewerAnOwner}
      isCardbacksAsset={isCardbacks}
      asset={asset}
    >
      <>
        <div
          className={cn(
            "mb-4 flex flex-nowrap items-center text-xl font-semibold text-white"
          )}
        >
          <span className="inline-block max-w-[100%_-_80px] truncate">
            {asset.metadata.name ? asset.metadata.name : "Unknown NFT"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Price</div>
            {asset.orderbookStats.lowestListingPrice ? (
              <Price
                variant="accent"
                amount={asset.orderbookStats.lowestListingPrice}
                isNativeToken={true}
                shouldDisplayFiatPrice={true}
                fiatPriceNewLine={true}
              />
            ) : (
              "No for sale yet"
            )}
          </div>
          <div>
            {asset.orderbookStats.highestOfferPrice && (
              <>
                <div className="text-sm font-medium">Best offer</div>
                <Price
                  variant="accent"
                  amount={asset.orderbookStats.highestOfferPrice}
                  isNativeToken={true}
                  shouldDisplayFiatPrice={true}
                  fiatPriceNewLine={true}
                />
              </>
            )}
          </div>
        </div>
        {children}
      </>
    </AssetCardBase>
  )
}
