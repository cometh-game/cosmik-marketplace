import React from "react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"

type WalletListProps = {
  wallets: { address: string; spaceships: number }[]
  mainAddress: string
}

const WalletList = ({ wallets, mainAddress }: WalletListProps) => {
  return (
    <>
      {wallets.map(({ address, spaceships }) => (
        <li key={address} className="border-b border-white/10 pb-3">
          {address === mainAddress ? (
            <>
              Internal address ({shortenAddress(address as Address)}): <br />
              <div className="font-bold">
                You have <span className="underline">{spaceships}</span> attached spaceship{spaceships > 1 ? "s" : ""} to
                your Cosmik Battle account
              </div>
            </>
          ) : (
            <>
              Associated external wallet ({shortenAddress(address as Address)}):
              <br />
              <div className="font-bold">
                You have <span className="underline">{spaceships ?? "..."}</span>{" "}
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
