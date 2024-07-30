import { OrderWithAsset } from "@cometh/marketplace-sdk"
import { Row } from "@tanstack/react-table"
import { Address } from "viem"

import { UserButton } from "@/components/ui/user/UserButton"

export type EmitterCellProps = {
  row: Row<OrderWithAsset & { makerUsername?: string }>
}

export const EmitterCell = ({ row }: EmitterCellProps) => {
  return (
    <UserButton
      user={{
        username: row.original.makerUsername,
        address: row.original.maker as Address,
      }}
    />
  )
}
