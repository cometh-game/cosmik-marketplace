import { useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast/use-toast"
import { ethers } from "ethers"
import { useDisconnect } from "@/lib/web3/auth"

export type RefreshStepProps = {
  userAddress: string
  onValid: () => void
}

export const RefreshStep: React.FC<RefreshStepProps> = ({
  userAddress,
  onValid,
}) => {
  const { initOnboard, retrieveWalletAddressFromSigner, setIsconnected } =
    useWeb3OnboardContext()
  const [isLoading, setIsLoading] = useState(false)
  const { connect: connectWallet } = useWalletConnect()
  const walletLogout = useDisconnect()

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await retrieveWalletAddressFromSigner(userAddress)
      
      try {
        initOnboard({
          isComethWallet: true,
          walletAddress: userAddress,
        })
        const wallet = await connectWallet({ isComethWallet: true })
        const walletAddress = ethers.utils.getAddress(
          wallet.accounts[0].address
        )
        if (walletAddress !== userAddress) {
          walletLogout({
            label: wallet.label,
          })
          throw new Error(
            "Your Cosmik wallet address doesn't match the one stored in your browser. Please contact support. #3"
          )
        }
        localStorage.setItem("currentWalletAddress", userAddress)
        setIsconnected(true)
        onValid()
      } catch (error) {
        console.error("Error connecting wallet", error)
      }

      toast({
        title: "Device succesfully Authorized!",
        description:
          "Your Cosmik Battle account has been successfully linked to the marketplace.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error in handleRefresh", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="text-muted-foreground">
        Please log-in to Cosmik Battle and validate this device to retrieve your
        items. Once this device is validated, please press refresh to update
        your inventory.
      </p>
      <Button
        size="lg"
        onClick={handleRefresh}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Refresh
      </Button>
    </>
  )
}
