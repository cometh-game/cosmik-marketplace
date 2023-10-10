"use client"

import { Button } from "../../ui/button"
import { AlertCircle, Loader } from "lucide-react"
import { useCorrectNetwork } from "@/lib/web3/network"

type SwitchNetworkProps = {
  callbackChildren?: React.ReactNode
  children?: React.ReactNode
}

export const SwitchNetwork = ({ callbackChildren, children }: SwitchNetworkProps) => {
  const {
    isChainSupported,
    switchToCorrectNetwork,
    settingChain,
  } = useCorrectNetwork();

  return (
    <>
      {isChainSupported ? children : (
        <>
          {callbackChildren ?? children}
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertCircle size="16" />
            <span className="text-sm font-medium">Network not supported.</span>
            <Button variant="destructive" className="h-8 px-3 font-medium" onClick={switchToCorrectNetwork} disabled={settingChain}>
              <span className="flex items-center gap-2">
                {settingChain ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Switching
                  </>
                ) : (
                  "Switch now"
                )}
              </span>
            </Button>
          </div>
        </>
      )}
    </>
  );
};