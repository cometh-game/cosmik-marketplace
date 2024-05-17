"use client"

import { useCallback } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

export function AccountLogoutAction() {
  const { disconnect } = useConnectComethWallet()

  const handleLogout = useCallback(async () => {
    await disconnect()
  }, [disconnect])

  return (
    <div className="absolute right-4 top-4">
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <Button variant="muted" size="icon" onClick={handleLogout}>
              <LogOut size="14" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm font-bold">Logout</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}