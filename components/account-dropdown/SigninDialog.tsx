"use client"

import { useCallback, useEffect, useState } from "react"
import { useUserAuthContext } from "@/providers/userAuth"
import { useAuth } from "@/services/cosmik/authService"
import { useCosmikOauthRedirect } from "@/services/cosmik/oauthService"
import { useCosmikSignin } from "@/services/cosmik/signinService"
import Bugsnag from "@bugsnag/js"
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
import Providers from "@/components/assets/providers"
import { AuthorizationProcess } from "@/components/connect-actions/buttons/AuthorizationProcess"
import { SignInForm } from "@/components/signin/SignInForm"

import { OrDivider } from "../ui/OrDivider"

export type SigninDialogProps = {
  isReconnecting: boolean
  fullVariant?: boolean
  customText?: string
  hideIcon?: boolean
}

export function SigninDialog({
  isReconnecting,
  fullVariant,
  customText,
  hideIcon,
}: SigninDialogProps) {
  const [displaySigninDialog, setDisplaySigninDialog] = useState(false)
  const { isPending } = useCosmikSignin()
  const { oauthRedirect } = useCosmikOauthRedirect()
  const {
    isLoading,
    displayAuthorizationProcess,
    setDisplayAuthorizationProcess,
    handleLoginSuccess,
  } = useAuth()
  const { getUser } = useUserAuthContext()

  useEffect(() => {
    if (displayAuthorizationProcess) {
      setDisplaySigninDialog(false)
    }
  }, [displayAuthorizationProcess])

  const handleSigninDialogChange = useCallback(
    (open: boolean) => {
      if (!open || !displayAuthorizationProcess) {
        setDisplaySigninDialog(open)
      }
    },
    [displayAuthorizationProcess]
  )

  const handleGoogleSignin = useCallback(() => {
    oauthRedirect()
  }, [oauthRedirect])

  console.log("getUser() in SigninDialog : ", getUser())
  console.log("displayAuthorizationProcess in SigninDialog : ", displayAuthorizationProcess)

  // const handleLoginSuccess = useCallback(
  //   async (user: User) => {
  //     if (!user) return

  //     try {
  //       setIsLoading(true)
  //       setUser(user)
  //       // Attempt to retrieve the wallet address to determine if it is the first connection
  //       await retrieveWalletAddress(user.address)
  //       // If passkey signer is found for this address, connect the wallet
  //       await connectComethWallet(user.address)
  //       // Bugsnag.setUser(user.id, user.email, user.userName)
  //       toast({
  //         title: "Login successful",
  //         duration: 3000,
  //       })
  //     } catch (error) {
  //       console.error("Error connecting wallet in SigninDialog", error)
  //       // Bugsnag.notify(error as Error, function (report) {
  //       //   report.context = "User Login"
  //       //   report.setUser(user.id, user.email, user.userName)
  //       //   report.addMetadata("user", user)
  //       // })
  //       // If an error occurs, likely due to a first-time connection, display the authorization modal
  //       setDisplaySigninDialog(false)
  //       setDisplayAutorizationProcess(true)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   },
  //   [connectComethWallet, retrieveWalletAddress]
  // )

  // const handleGoogleSignin = useCallback(() => {
  //   oauthRedirect()
  // }, [oauthRedirect])

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
          <OrDivider text="or" />
          <Button variant="ghost" size="lg" onClick={handleGoogleSignin}>
            <Providers.Google size={20} className="mr-2" />
            Signin with Google
          </Button>
        </DialogContent>
      </Dialog>

      {displayAuthorizationProcess && getUser() && (
        <AuthorizationProcess
          isOpen={displayAuthorizationProcess}
          onClose={() => setDisplayAuthorizationProcess(false)}
          user={getUser()}
        />
      )}
    </>
  )
}
