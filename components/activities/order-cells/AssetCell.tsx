import Link from "next/link"
import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"
import { ExternalLink } from "lucide-react"

export type AssetCellProps = {
  row: Row<OrderWithAsset>
}

export const AssetCell = ({ row }: AssetCellProps) => {
  const assetName = row.original.asset?.metadata.name
  const tokenId = row.original.tokenId
  const tokenAddress = row.original.tokenAddress

  return (
    <Link
      href={`/nfts/${tokenAddress}/${tokenId}`}
      className="relative z-[1] inline-flex items-center gap-x-2 font-medium transition-colors hover:text-white"
    >
      {assetName} <ExternalLink size="16" />
    </Link>
  )
}
