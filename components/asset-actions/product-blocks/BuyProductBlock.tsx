// import { useUsername } from "@/services/user/userNameService"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Price } from "@/components/ui/Price"
import { UserLink } from "@/components/ui/user/UserLink"
import { AuthenticationButton } from "@/components/AuthenticationButton"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlock"

import { BuyAssetButton } from "../buttons/BuyAssetButton"
import { MakeBuyOfferButton } from "../buttons/MakeBuyOfferPriceDialog"
import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { BestOfferColumn } from "./columns/BestOfferColumn"
import { useGetUser } from "@/services/cosmik/userService"

export type BuyProductBlockProps = {
  asset: AssetWithTradeData
}

export function BuyProductBlock({ asset }: BuyProductBlockProps) {
  const listingPrice = asset.orderbookStats.lowestListingPrice
  // const { username, isFetchingUsername } = useUsername(asset.owner as Address)
  const { user, isFetching: isFetchingUsername } = useGetUser(asset.owner as Address)

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <Price
          size="lg"
          variant="accent"
          amount={listingPrice}
          isNativeToken={true}
          shouldDisplayFiatPrice={true}
          fiatPriceNewLine={true}
        />
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        {!isFetchingUsername && (
          <UserLink
            variant="link"
            // className="mt-1"
            user={{ address: asset.owner as Address, username: user.userName }}
          />
        )}
      </ProductBlockDividedColumn>
      <ProductBlockCenteredColumn>
        <AuthenticationButton fullVariant customText="Login to buy">
          <SwitchNetwork>
            <BuyAssetButton asset={asset} />
            <MakeBuyOfferButton asset={asset} />
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
