import { useEffect, useState } from "react"
import Link from "next/link"
import { useAddExternalWallet } from "@/services/cosmik/addExternalWalletService"
import { User } from "@/services/cosmik/signinService"
import { useGetUserNonce } from "@/services/cosmik/userNonceService"
import { SupportedNetworks } from "@cometh/connect-sdk"
import { AssetSearchFilters } from "@cometh/marketplace-sdk"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { SiweMessage } from "siwe"
import { numberToHex } from "viem"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"

import { env } from "@/config/env"
import globalConfig from "@/config/globalConfig"
import { comethMarketplaceSpaceshipsClient } from "@/lib/clients"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"

import { AccountLogoutAction } from "./account-dropdown/AccountLogoutAction"
import { Button } from "./ui/Button"
import { Loading } from "./ui/Loading"
import WalletList from "./wallets/WalletList"

type WalletsDialogProps = {
  user: User
}

export function WalletsDialog({ user }: WalletsDialogProps) {
  const { open } = useWeb3Modal()
  const { disconnectAsync } = useDisconnect()
  const { address: walletAddress } = useAccount()
  const { mutateAsync: getUserNonceAsync } = useGetUserNonce()
  const { mutateAsync: addExternalWallet } = useAddExternalWallet()
  const { signMessageAsync: signMessage } = useSignMessage()
  const [wallets, setWallets] = useState<
    { address: string; spaceships: number }[]
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const updateWallets = async () => {
      setLoading(true)
      const walletAddresses = [user.address, ...user.externalAddresses]
      const promises = walletAddresses.map(async (address) => {
        try {
          const filters: AssetSearchFilters = {
            contractAddress: globalConfig.shipsContractAddress,
            owner: address,
            limit: 9999,
          }
          const spaceships =
            await comethMarketplaceSpaceshipsClient.asset.searchAssets(filters)
          return { address, spaceships: spaceships.total }
        } catch (error) {
          console.error(
            "Error fetching assets count for address",
            address,
            error
          )
          return { address, spaceships: 0 }
        }
      })

      try {
        const results = await Promise.all(promises)
        setWallets(results)
      } finally {
        setLoading(false)
      }
    }

    updateWallets()
  }, [user.address, user.externalAddresses])

  useEffect(() => {
    if (walletAddress) {
      handleAddExternalWallet()
    }
  }, [walletAddress])

  async function createMessage({
    nonce,
    statement,
  }: {
    nonce: string
    statement: string
  }) {
    if (!window || !walletAddress) {
      throw new Error("No window or wallet")
    }

    const message = new SiweMessage({
      domain: window.location.host,
      address: walletAddress,
      statement,
      uri: window.location.origin,
      version: "1",
      chainId: Number(
        numberToHex(env.NEXT_PUBLIC_NETWORK_ID) as SupportedNetworks
      ),
      nonce,
    })

    return message
  }

  async function handleAddExternalWallet() {
    try {
      if (!walletAddress) {
        throw new Error("No wallet")
      }
      const { nonce } = await getUserNonceAsync({ walletAddress })
      const message = await createMessage({
        nonce,
        statement: "Connect to Cosmik Battle to link your wallet.",
      })
      const signature = await signMessage({
        message: message.prepareMessage(),
      })
      await addExternalWallet(
        { walletAddress, nonce, signature, message },
        {
          onSuccess: () => {
            setWallets((prevWallets) => [
              ...prevWallets,
              { address: walletAddress, spaceships: 0 },
            ])
          },
        }
      )
      // disconnect after added wallet
      await disconnectAsync()
    } catch (error) {
      console.error("Error connecting wallet", error)
    }
  }

  return (
    <div className="dialog max-w-[400px]">
      <Dialog modal open={true}>
        <DialogContent
          className="sm:max-w-[400px]"
          shouldDisplayOverlay={false}
          shouldDisplayCloseBtn={false}
        >
          <DialogHeader className="flex-row items-center justify-between space-y-0">
            <DialogTitle className="normal-case">@{user?.userName}</DialogTitle>
            {(user || walletAddress) && <AccountLogoutAction />}
          </DialogHeader>
          <ul className="space-y-3">
            {loading ? (
              <Loading />
            ) : (
              <WalletList wallets={wallets} mainAddress={user.address} />
            )}
          </ul>
          <div className="text-muted-foreground">
            Add an external wallet to link existing assets to your cosmik Battle
            account
          </div>
          <Button
            size="lg"
            onClick={() => {
              open({ view: "Connect" })
            }}
          >
            Add external wallet
          </Button>
          <div className="text-center">
            <Link href="/nfts">Back to marketplace</Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
