/**
 * This block is displayed when the viewer has
 * listed the asset for sale.
 */

import { useUsername } from "@/services/user/userNameService"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { Price } from "@/components/ui/Price"
import { UserLink } from "@/components/ui/user/UserLink"
import { AuthenticationButton }  from "@/components/AuthenticationButton"
import { AssetStatusBadge } from "@/components/marketplace/asset/AssetStatusBadge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlock"

import { CancelListingButton } from "../buttons/CancelListingButton"
import { SwitchNetwork } from "../buttons/SwitchNetwork"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function ViewerListingProductBlock({ asset }: SellProductBlockProps) {
  const { username, isFetchingUsername } = useUsername(asset.owner as Address)

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <Price size="lg" amount={asset.orderbookStats.lowestListingPrice} isNativeToken={true} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Best Offer</ProductBlockLabel>
        <Price size="lg" amount={asset.orderbookStats.highestOfferPrice} isNativeToken={true} />
      </ProductBlockDividedColumn>

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Listed by</ProductBlockLabel>
        {!isFetchingUsername && (
          <UserLink
            variant="link"
            className="mt-1"
            user={{ address: asset.owner as Address, username: username }}
          />
        )}
      </ProductBlockDividedColumn>

      <ProductBlockCenteredColumn>
        <AuthenticationButton fullVariant>
          <SwitchNetwork>
            <CancelListingButton asset={asset} />
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
