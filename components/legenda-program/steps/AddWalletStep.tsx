import { useEffect, useState } from "react"
import { User } from "@/services/cosmik/signinService"
import { useGetUserNonce } from "@/services/cosmik/userNonceService"
import { SupportedNetworks } from "@cometh/connect-sdk"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { SiweMessage } from "siwe"
import { numberToHex } from "viem"
import { useAccount, useDisconnect, useSignMessage } from "wagmi"

import { env } from "@/config/env"
import { Loading } from "@/components/ui/Loading"
import { toast } from "@/components/ui/toast/hooks/useToast"

import { Button } from "../../ui/Button"
import { useGetStatus, useRegisterAddress } from "../LegendaRewardsHook"

type AddWalletStepProps = {
  user: User
  onValid: () => void
}

export function AddWalletStep({ user, onValid }: AddWalletStepProps) {
  const { open, close } = useWeb3Modal()
  const { disconnectAsync } = useDisconnect()
  const { address: walletAddress, isConnected } = useAccount()
  const { status: hasClaimedRewards, isLoadingStatus } = useGetStatus()
  const { getUserNonceAsync } = useGetUserNonce()
  const { registerAddress } = useRegisterAddress()
  const { signMessageAsync: signMessage } = useSignMessage()
  const [isWalletAlreadyClaimed, setIsWalletAlreadyClaimed] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      handleRegisterAddress()
    }
  }, [walletAddress])

  async function createMessage({
    nonce,
    statement,
  }: {
    nonce: string
    statement: string
  }) {
    if (!walletAddress) {
      throw new Error("No wallet")
    }
    if (user.address === walletAddress) {
      throw new Error("Cannot add primary wallet")
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

  async function handleRegisterAddress() {
    try {
      if (!walletAddress) {
        throw new Error("No wallet")
      }

      const { nonce } = await getUserNonceAsync({ walletAddress })
      if (!nonce) {
        throw new Error("No user nonce found")
      }
      const message = await createMessage({
        nonce,
        statement: "Connect to Cosmik Battle to link your wallet.",
      })
      if (!message) {
        throw new Error("No message found")
      }
      const messageToSign = message.prepareMessage()
      const signature = await signMessage({
        message: messageToSign,
      })

      await registerAddress({ walletAddress, nonce, signature, message })
      // disconnect after added wallet
      await disconnectAsync()

      onValid()
    } catch (error: any) {
      console.error(error)
      if (error.message === "WALLET_ALREADY_CLAIMED") {
        setIsWalletAlreadyClaimed(true)
      } else {
        toast({
          title: "Error adding wallet",
          description: error?.message || "Please retry or contact support",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoadingStatus) {
    return <Loading />
  }

  return (
    <>
      {hasClaimedRewards || isWalletAlreadyClaimed ? (
        <>
          <h3 className="text-xl font-semibold">Add your wallet</h3>
          <p>
            Hi there Pilot, you have already claimed your Legenda Program
            rewards {isWalletAlreadyClaimed ? "with this wallet" : ""}. Pilots
            can only redeem rewards once per account and per wallet. For more
            information about the Legenda Program and your rewards, please visit{" "}
            <a
              href=""
              target="_blank"
              rel="noreferrer"
              className="hover:text-accent-foreground font-medium underline transition-colors"
            >
              XXX
            </a>
            .
          </p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold">Add your wallet</h3>
          <p>
            Welcome to the Legenda Program, our reward initiative for former
            Cometh Battle players
          </p>
          <div className="mt-2 flex gap-4">
            <Button
              size="lg"
              onClick={() => {
                open({ view: "Connect" })
              }}
              disabled={isLoadingStatus || hasClaimedRewards}
            >
              Connect your external wallet to claim your rewards
            </Button>
          </div>
        </>
      )}
    </>
  )
}
