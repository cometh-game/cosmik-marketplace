import React from "react"
import { useRemoveExternalWallet } from "@/services/cosmik/externalWalletService"
import { CircleX } from "lucide-react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"

import { WalletRemoveAction } from "./WalletRemoveAction"

type WalletListProps = {
  wallets: { address: string; spaceships: number }[]
  mainAddress: string
  onRemove: (address: string) => void
}

const WalletList = ({ wallets, mainAddress, onRemove }: WalletListProps) => {
  return (
    <>
      {wallets.map(({ address, spaceships }) => (
        <li key={address} className="border-b border-white/10 pb-3">
          {address === mainAddress ? (
            <>
              Internal address ({shortenAddress(address as Address)}): <br />
              <div className="font-bold">
                You have <span className="underline">{spaceships}</span>{" "}
                attached spaceship{spaceships > 1 ? "s" : ""} to your Cosmik
                Battle account
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-x-2">
                Associated external wallet ({shortenAddress(address as Address)}
                )
                <WalletRemoveAction onRemove={() => onRemove(address)} />
              </div>
              <div className="font-bold">
                You have{" "}
                <span className="underline">{spaceships ?? "..."}</span>{" "}
                spaceships to this wallet
              </div>
            </>
          )}
        </li>
      ))}
    </>
  )
}

export default WalletList
