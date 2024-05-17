// import { useUsername } from "@/services/user/userNameService"
import { AssetWithTradeData } from "@cometh/marketplace-sdk"
import { Address } from "viem"

import { UserLink } from "@/components/ui/user/UserLink"
import { AuthenticationButton }  from "@/components/AuthenticationButton"
import { AssetStatusBadge } from "@/components/marketplace/asset/AssetStatusBadge"
import {
  ProductBlockCenteredColumn,
  ProductBlockContainer,
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlockContainer"

import { SellAssetButton } from "../buttons/SellAssetButton"
import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { BestOfferColumn } from "./BestOfferColumn"
import { useGetUser } from "@/services/cosmik/userService"

export type SellProductBlockProps = {
  asset: AssetWithTradeData
}

export function SellProductBlock({ asset }: SellProductBlockProps) {
  // const { username, isFetchingUsername } = useUsername(asset.owner as Address)
  const { user, isFetching: isFetchingUsername } = useGetUser(asset.owner as Address)

  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <AssetStatusBadge status="not-listed" />
        <span className="ml-2">-</span>
      </ProductBlockDividedColumn>

      <BestOfferColumn asset={asset} />

      <ProductBlockDividedColumn>
        <ProductBlockLabel>Owned by</ProductBlockLabel>
        {!isFetchingUsername && (
          <UserLink
            variant="link"
            className="mt-0.5"
            user={{ address: asset.owner as Address, username: user?.userName }}
          />
        )}
      </ProductBlockDividedColumn>

      <ProductBlockCenteredColumn>
        <AuthenticationButton fullVariant>
          <SwitchNetwork>
            <SellAssetButton asset={asset} />
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
