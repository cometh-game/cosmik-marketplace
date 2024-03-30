"use client"

import { useMemo } from "react"
import Link from "next/link"
import { manifest } from "@/manifests/manifests"
import {
  AssetAttribute,
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { animated, config, useSpring } from "react-spring"
import { useBoolean } from "usehooks-ts"
import { useAccount } from "wagmi"

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
  asset,
}: AssetCardBaseProps) {
  const isHovered = useBoolean(false)

  const cardTextHeightsClass = manifest.fiatCurrency.enable
    ? "sm:h-[110px]"
    : "sm:h-[100px]"

  const isCardbacks =
    asset.metadata.image?.includes("/cardbacks/") ||
    asset.metadata.image_data?.includes("/cardbacks/")

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
          isOwnerAsset && "bg-[#f4f2e8]/[.02]"
        )}
      >
        <Link
          href={`/nfts/${asset.contractAddress}/${asset.tokenId}`}
          className="sm:w-full sm:flex-1"
        >
          <AssetImageContainer
            color={getAssetColor(asset)}
            isHovered={isHovered.value}
          >
            <AssetImage
              src={src}
              fallback={fallback}
              imageData={asset.metadata.image_data}
              height={380}
              width={320}
              className={cn("z-20 size-full rounded-lg object-contain", {
                "p-8": isCardbacks,
              })}
            />
          </AssetImageContainer>
        </Link>
        <div className="w-full pl-2 sm:p-5">{children}</div>
      </Card>
    </Appear>
  )
}

export function AssetCard({ asset, children }: AssetCardProps) {
  const account = useAccount()
  const viewerAddress = account.address

  const isOwnerAsset = useMemo(() => {
    return asset.owner === viewerAddress?.toLowerCase()
  }, [viewerAddress, asset.owner])

  return (
    <AssetCardBase
      src={asset.cachedImageUrl}
      fallback={asset.metadata.image}
      isOwnerAsset={isOwnerAsset}
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
            {!isOwnerAsset && (
              <div className="mb-1 text-sm font-medium">Price</div>
            )}
            {asset.orderbookStats.lowestListingPrice ? (
              <Price
                size="sm"
                variant="accent"
                amount={asset.orderbookStats.lowestListingPrice}
                shouldDisplayFiatPrice={true}
                fiatPriceNewLine={true}
                isNativeToken={true}
              />
            ) : isOwnerAsset ? (
              <SellAssetButton
                size="sm"
                asset={asset as unknown as AssetWithTradeData}
              />
            ) : (
              "No listed yet"
            )}
          </div>
          <div>
            {asset.orderbookStats.highestOfferPrice && (
              <>
                <div className="text-sm font-medium">Best offer</div>
                <Price
                  size="sm"
                  amount={asset.orderbookStats.highestOfferPrice}
                  shouldDisplayFiatPrice={true}
                  fiatPriceNewLine={true}
                />
              </>
            )}
            <div className="text-end">
              {renderAssetActions(asset, isOwnerAsset)}
            </div>
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
    button = <BuyAssetButton size="sm" asset={asset} />
    buttonText = "Buy now "
  } else if (!isOwnerAsset) {
    button = (
      <MakeBuyOfferButton
        size="sm"
        asset={asset as unknown as AssetWithTradeData}
      />
    )
    buttonText = "Make an offer"
  } else if (!asset.orderbookStats.lowestListingPrice) {
    button = (
      <SellAssetButton
        size="sm"
        asset={asset as unknown as AssetWithTradeData}
      />
    )
    buttonText = "Sell now"
  } else {
    button = (
      <CancelListingButton
        size="sm"
        asset={asset as unknown as AssetWithTradeData}
      />
    )
    buttonText = "Cancel listing"
  }

  if (button) {
    return (
      <div className="hidden sm:block">
        <AuthenticationButton size="sm" customText={buttonText}>
          {button}
        </AuthenticationButton>
      </div>
    )
  }
}
