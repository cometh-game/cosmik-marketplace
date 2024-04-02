"use client"

import { useCallback, useEffect, useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useCosmikSignin, User } from "@/services/cosmik/signinService"
import { cx } from "class-variance-authority"
import { WalletIcon } from "lucide-react"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { AuthorizationProcess } from "@/components/connect-actions/buttons/AuthorizationProcess"
import { SignInForm } from "@/components/signin/SignInForm"

export type SigninDropdownProps = {
  isReconnecting: boolean
  fullVariant?: boolean
  customText?: string
  hideIcon?: boolean
}

export function SigninDropdown({
  isReconnecting,
  fullVariant,
  customText,
  hideIcon,
}: SigninDropdownProps) {
  const [user, setUser] = useState<User | null>(null)
  const [displayAutorizationProcess, setDisplayAutorizationProcess] =
    useState(false)
  const [displaySigninDialog, setDisplaySigninDialog] = useState(false)
  const { isSuccess, isPending, data } = useCosmikSignin()
  const [isLoading, setIsLoading] = useState(false)
  const { connectComethWallet, retrieveWalletAddress } =
    useConnectComethWallet()

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
        console.log("User address", user.address)
        // Attempt to retrieve the wallet address to determine if it is the first connection
        await retrieveWalletAddress(user.address)
        // If passkey signer is found for this address, connect the wallet
        await connectComethWallet(user.address)
        toast({
          title: "Login successful",
          duration: 3000,
        })
      } catch (error) {
        console.error("Error connecting wallet in SigninDropdown", error)
        // If an error occurs, likely due to a first-time connection, display the authorization modal
        setDisplaySigninDialog(false)
        setDisplayAutorizationProcess(true)
      } finally {
        setIsLoading(false)
      }
    },
    [connectComethWallet, retrieveWalletAddress]
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
            disabled={isReconnecting || isPending}
            isLoading={isReconnecting || isPending}
          >
            {!hideIcon && <WalletIcon size="16" className="mr-2" />}
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
            isLoading={isReconnecting || isLoading}
          />
        </DialogContent>
      </Dialog>

      {displayAutorizationProcess && (
        <AuthorizationProcess
          isOpen={displayAutorizationProcess}
          onClose={() => setDisplayAutorizationProcess(false)}
          user={user!}
        />
      )}
    </>
  )
}
