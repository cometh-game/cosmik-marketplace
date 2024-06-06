import { useEffect, useState } from "react"
import Link from "next/link"
import {
  useAddExternalWallet,
  useRemoveExternalWallet,
} from "@/services/cosmik/externalWalletService"
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
import { toast } from "./ui/toast/hooks/useToast"
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
  const { mutateAsync: removeExternalWallet } = useRemoveExternalWallet()
  const { signMessageAsync: signMessage } = useSignMessage()
  const [wallets, setWallets] = useState<
    { address: string; spaceships: number }[]
  >([])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetchWallets()
  }, [user?.externalAddresses])

  useEffect(() => {
    if (walletAddress) {
      handleAddExternalWallet()
    }
  }, [walletAddress])

  const fetchWallets = async () => {
    setLoading(true)
    const walletAddresses = [user.address, ...user.externalAddresses]
    const promises = walletAddresses.map((address) => fetchSpaceships(address))

    try {
      const results = await Promise.all(promises)
      setWallets(results)
    } finally {
      setLoading(false)
    }
  }

  async function fetchSpaceships(walletAddress: string) {
    try {
      const filters: AssetSearchFilters = {
        contractAddress: globalConfig.shipsContractAddress,
        owner: walletAddress,
        limit: 9999,
      }
      const spaceships =
        await comethMarketplaceSpaceshipsClient.asset.searchAssets(filters)
      return { address: walletAddress, spaceships: spaceships.total }
    } catch (error) {
      console.error(
        "Error fetching assets count for address",
        walletAddress,
        error
      )
      return { address: walletAddress, spaceships: 0 }
    }
  }

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
      const walletExists = wallets.some(
        (wallet) => wallet.address === walletAddress
      )
      if (walletExists) {
        throw new Error("This wallet address has already been added.")
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
          onSuccess: async () => {
            const newWallet = await fetchSpaceships(walletAddress)
            setWallets((prevWallets) => [...prevWallets, newWallet])
          },
        }
      )
      // disconnect after added wallet
      await disconnectAsync()
    } catch (error: any) {
      toast({
        title: "Error adding wallet",
        description: error?.message || "Please retry or contact support",
        variant: "destructive",
      })
    }
  }

  async function handleRemoveExternalWallet(walletAddress: string) {
    try {
      await removeExternalWallet(
        { walletAddress },
        {
          onSuccess: () => {
            setWallets(
              wallets.filter((wallet) => wallet.address !== walletAddress)
            )
          },
        }
      )
    } catch (error) {
      console.log("Error removing wallet", error)
    }
  }

  return (
    <div className="dialog max-w-[440px]">
      <Dialog modal open={true}>
        <DialogContent
          className="sm:max-w-[440px]"
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
              <WalletList
                wallets={wallets}
                mainAddress={user?.address}
                onRemove={handleRemoveExternalWallet}
              />
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
