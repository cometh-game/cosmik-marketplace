import { AssetWithTradeData } from "@cometh/marketplace-sdk"

import { Price } from "@/components/ui/Price"
import {
  ProductBlockDividedColumn,
  ProductBlockLabel,
} from "@/components/ProductBlockContainer"

export type BestOfferColumnProps = {
  asset: AssetWithTradeData
}

export const BestOfferColumn = ({ asset }: BestOfferColumnProps) => {
  return (
    <ProductBlockDividedColumn>
      <ProductBlockLabel>
        <span className="inline-flex items-center">Best Offer</span>
      </ProductBlockLabel>
      <Price
        size="lg"
        variant="accent"
        amount={asset.orderbookStats.highestOfferPrice}
        isNativeToken={true}
      />
    </ProductBlockDividedColumn>
  )
}
