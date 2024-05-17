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

import { MakeBuyOfferButton } from "../buttons/MakeBuyOfferPriceDialog"
import { SwitchNetwork } from "../buttons/SwitchNetwork"
import { BestOfferColumn } from "./BestOfferColumn"
import { useGetUser } from "@/services/cosmik/userService"

export type NotListedProductBlockProps = {
  asset: AssetWithTradeData
}

export function NotListedProductBlock({ asset }: NotListedProductBlockProps) {
  // const { username, isFetchingUsername } = useUsername(asset.owner as Address)
  const { user, isFetching: isFetchingUsername } = useGetUser(asset.owner as Address)
  console.log('user', user)
  return (
    <ProductBlockContainer>
      <ProductBlockDividedColumn>
        <ProductBlockLabel>Price</ProductBlockLabel>
        <AssetStatusBadge status="not-listed" />
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
        <AuthenticationButton customText="Login to make an offer" fullVariant>
          <SwitchNetwork>
            <MakeBuyOfferButton asset={asset} />
          </SwitchNetwork>
        </AuthenticationButton>
      </ProductBlockCenteredColumn>
    </ProductBlockContainer>
  )
}
