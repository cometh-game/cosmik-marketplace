"use client"

import { useCallback, useEffect, useState } from "react"
import { useWeb3OnboardContext } from "@/providers/web3-onboard"
import { useCosmikSignin, User } from "@/services/cosmik/signin"
import { useStorageWallet } from "@/services/web3/use-storage-wallet"
import { useWalletConnect } from "@/services/web3/use-wallet-connect"
import { cx } from "class-variance-authority"
import { ethers } from "ethers"
import { WalletIcon } from "lucide-react"

import { useDisconnect } from "@/lib/web3/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AuthorizationProcess } from "@/components/connect-actions/buttons/authorization-process"
import { SignInForm } from "@/components/signin/signin-form"

import { toast } from "../ui/toast/use-toast"

export type SigninDropdownProps = {
  disabled: boolean
  fullVariant?: boolean
  customText?: string
  isLinkVariant?: boolean
}

export function SigninDropdown({
  disabled,
  fullVariant,
  customText,
  isLinkVariant,
}: SigninDropdownProps) {
  const { initOnboard, setIsconnected, retrieveWalletAddressFromSigner } =
    useWeb3OnboardContext()
  const [user, setUser] = useState<User | null>(null)
  const [displayAutorizationProcess, setDisplayAutorizationProcess] =
    useState(false)
  const [displaySigninDialog, setDisplaySigninDialog] = useState(false)
  const { isSuccess, isPending, data } = useCosmikSignin()
  const { connect: connectWallet } = useWalletConnect()
  const [isLoading, setIsLoading] = useState(false)
  const walletLogout = useDisconnect()

  const handleSigninDialogChange = useCallback(
    (open: boolean) => {
      if (!open || !displayAutorizationProcess) {
        setDisplaySigninDialog(open)
      }
    },
    [displayAutorizationProcess]
  )

  const handleLoginSuccess = useCallback(
    async (user: User) => {
      try {
        setIsLoading(true)
        setUser(user)
        // Attempt to retrieve the wallet address to determine if it is the first connection
        await retrieveWalletAddressFromSigner(user.address)
        initOnboard({
          isComethWallet: true,
          walletAddress: user.address,
        })
        const wallet = await connectWallet({ isComethWallet: true })
        const walletAddress = ethers.utils.getAddress(
          wallet.accounts[0].address
        )
        if (walletAddress !== user.address) {
          walletLogout({
            label: wallet.label,
          })
          throw new Error(
            "Your Cosmik wallet address doesn't match the one stored in your browser. Please contact support. 3"
          )
        }
        // console.log("connectionResult", connectionResult)
        localStorage.setItem("currentWalletAddress", user.address)
        setIsconnected(true)

        toast({
          title: "Login successful",
          duration: 3000,
        })
      } catch (error) {
        // If an error occurs, likely due to a first-time connection, display the authorization modal
        setDisplaySigninDialog(false)
        setDisplayAutorizationProcess(true)
      } finally {
        setIsLoading(false)
      }
    },
    [
      connectWallet,
      initOnboard,
      retrieveWalletAddressFromSigner,
      setIsconnected,
    ]
  )

  useEffect(() => {
    if (isSuccess) {
      handleLoginSuccess(data.user)
    }
  }, [isSuccess, handleLoginSuccess])

  return (
    <>
      <Dialog
        open={displaySigninDialog}
        onOpenChange={handleSigninDialogChange}
      >
        <DialogTrigger asChild>
          <Button
            className={cx({
              "h-12 w-full": fullVariant,
            })}
            disabled={disabled || isPending}
            isLoading={disabled || isPending}
          >
            {!isLinkVariant && <WalletIcon size="16" className="mr-2" />}
            {customText ? customText : "Login"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="capitalize">Signin</DialogTitle>
          </DialogHeader>
          <p>
            To access the marketplace and trade cards, please log in with your
            Cosmik Battle credentials. <br />
            No account?{" "}
            <a
              href="https://store.epicgames.com/fr/p/cosmik-battle-f6dbf4"
              className="font-medium underline"
              target="_blank"
              rel="noreferrer"
            >
              Download Cosmik Battle
            </a>
          </p>
          <SignInForm
            onLoginSuccess={handleLoginSuccess}
            isDisabled={disabled}
            isLoading={disabled || isLoading}
          />
        </DialogContent>
      </Dialog>

      {displayAutorizationProcess && user && (
        <AuthorizationProcess
          isOpen={displayAutorizationProcess}
          onClose={() => setDisplayAutorizationProcess(false)}
          user={user}
        />
      )}
    </>
  )
}
