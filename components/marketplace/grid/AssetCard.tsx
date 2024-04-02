"use client"

import { useMemo } from "react"
import Link from "next/link"
import { manifest } from "@/manifests/manifests"
import { useCurrentCollectionContext } from "@/providers/currentCollection/currentCollectionContext"
import { useGetCollection } from "@/services/cometh-marketplace/collectionService"
import {
  AssetAttribute,
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { animated, config, useSpring } from "react-spring"
import { useBoolean } from "usehooks-ts"
import { Address } from "viem"
import { useAccount } from "wagmi"

import globalConfig from "@/config/globalConfig"
import { getRandomArrayElement } from "@/lib/utils/arrays"
import { getAssetColor } from "@/lib/utils/colorsAttributes"
import { cn } from "@/lib/utils/utils"
import { Appear } from "@/components/ui/Appear"
import { AssetImage } from "@/components/ui/AssetImage"
import { Card } from "@/components/ui/Card"
import { Price } from "@/components/ui/Price"
import { BuyAssetButton } from "@/components/asset-actions/buttons/BuyAssetButton"
import { CancelListingButton } from "@/components/asset-actions/buttons/CancelListingButton"
import { MakeBuyOfferButton } from "@/components/asset-actions/buttons/MakeBuyOfferPriceDialog"
import { SellAssetButton } from "@/components/asset-actions/buttons/SellAssetButton"
import { AuthenticationButton } from "@/components/AuthenticationButton"

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
  isOwnerAsset: boolean
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
          // !color && "bg-[rgba(255,255,255,0.01)]",
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
  isOwnerAsset,
  isCardbacksAsset,
  asset,
}: AssetCardBaseProps) {
  const isHovered = useBoolean(false)
  const imageAspectRatio =
    globalConfig.collectionSettingsByAddress[
      asset.contractAddress.toLowerCase() as Address
    ].imageAspectRatio

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
          isOwnerAsset && "bg-[#f4f2e8]/[.02]"
        )}
      >
        <div className="relative w-1/3 sm:w-full">
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
                  "p-8": isCardbacksAsset,
                })}
              />
            </AssetImageContainer>
          </Link>

          <div
            className={cn(
              !isHovered.value && "hidden",
              "absolute bottom-4 left-1/2 -translate-x-1/2"
            )}
          >
            {renderAssetActions(asset, isOwnerAsset)}
          </div>
        </div>
        
        <div className={cn("h-full w-2/3 sm:w-full")}>
          <Link
            href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
            className={cn(
              "flex h-full flex-nowrap font-medium text-white "
            )}
          >
            <div className="w-full pl-2 sm:p-5">{children}</div>
          </Link>
        </div>
      </Card>
    </Appear>
  )
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const account = useAccount()
  const viewerAddress = account.address
  const { currentCollectionAddress } = useCurrentCollectionContext()
  const { data: collection } = useGetCollection(currentCollectionAddress)
  const isCardbacks = collection?.name === "Cardbacks"

  const isOwnerAsset = useMemo(() => {
    return asset.owner === viewerAddress?.toLowerCase()
  }, [viewerAddress, asset.owner])

  return (
    <AssetCardBase
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      isOwnerAsset={isOwnerAsset}
      isCardbacksAsset={isCardbacks}
      asset={asset}
    >
      <>
        <Link
          href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
          className={cn(
            "mb-4 flex flex-nowrap items-center text-xl font-semibold text-white"
          )}
        >
          <span className="inline-block max-w-[100%_-_80px] truncate">
            {asset.metadata.name ? asset.metadata.name : "Unknown NFT"}
          </span>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="mb-1 text-sm font-medium">Price</div>
            {asset.orderbookStats.lowestListingPrice ? (
              <Price
                variant="accent"
                amount={asset.orderbookStats.lowestListingPrice}
                shouldDisplayFiatPrice={true}
                fiatPriceNewLine={true}
              />
            ): (
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

function renderAssetActions(
  asset: SearchAssetWithTradeData & {
    metadata: {
      attributes?: AssetAttribute[]
    }
  },
  isOwnerAsset: boolean
) {
  let button = undefined
  let buttonText = ""
  if (asset.orderbookStats.lowestListingPrice && !isOwnerAsset) {
    button = <BuyAssetButton asset={asset} />
    buttonText = "Buy now "
  } else if (!isOwnerAsset) {
    button = (
      <MakeBuyOfferButton
        asset={asset as unknown as AssetWithTradeData}
      />
    )
    buttonText = "Make an offer"
  } else if (!asset.orderbookStats.lowestListingPrice) {
    button = (
      <SellAssetButton
        asset={asset as unknown as AssetWithTradeData}
      />
    )
    buttonText = "Sell now"
  } else {
    button = (
      <CancelListingButton
        asset={asset as unknown as AssetWithTradeData}
      />
    )
    buttonText = "Cancel listing"
  }

  if (button) {
    return (
      <div className="hidden sm:block">
        <AuthenticationButton customText={buttonText} hideIcon={true}>
          {button}
        </AuthenticationButton>
      </div>
    )
  }
}
