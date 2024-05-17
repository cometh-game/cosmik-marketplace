"use client"

import { ColumnDef } from "@tanstack/react-table"

import { BuyOffer } from "@/types/buy-offers"

import { AmountCell } from "../../order-cells/OLD_AmountCell"
import { CTACell } from "../../order-cells/CancelBuyOfferCell"
import { DateCell } from "../../order-cells/DateCell"
import { EmitterCell } from "../../order-cells/EmitterCell"

export const columns: ColumnDef<BuyOffer>[] = [
  {
    accessorKey: "emitter",
    header: "Emitter",
    cell: EmitterCell,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: AmountCell,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: DateCell,
  },
  {
    accessorKey: "cta",
    header: "",
    cell: CTACell,
  },
]
