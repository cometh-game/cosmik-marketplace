"use client"

import { LogOut } from "lucide-react"

import { useDisconnect, useWallet } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCosmikLogout } from "@/services/cosmik/logout"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"

export function AccountLogAction() {
  const wallet = useWallet()
  const walletLogout = useDisconnect()
  const { mutateAsync: cosmikLogout } = useCosmikLogout()
  const { setIsconnected } = useWeb3OnboardContext()

  async function handleLogout() {
    // await logout()
    try {
      await walletLogout({
        label: wallet!.label,
      })
      await cosmikLogout();
      setIsconnected(false)
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="absolute right-4 top-4">
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <Button
              variant="muted"
              size="icon"
              onClick={handleLogout}
            >
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
