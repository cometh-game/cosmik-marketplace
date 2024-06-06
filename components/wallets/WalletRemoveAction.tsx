"use client"

import { CircleX } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

export function WalletRemoveAction({ onRemove }: { onRemove: () => void }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip defaultOpen={false}>
        <TooltipTrigger asChild>
          <button onClick={onRemove}>
            <CircleX size="18" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm font-bold">Remove</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
