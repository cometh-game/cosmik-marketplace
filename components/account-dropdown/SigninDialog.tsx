"use client"

import { useCallback, useEffect, useState } from "react"
import { useUserAuthContext } from "@/providers/userAuth"
import { useAuth } from "@/services/cosmik/authService"
import {
  useCosmikOauthRedirect,
} from "@/services/cosmik/oauthService"
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
  const { oauthRedirect, isPending } = useCosmikOauthRedirect()
  const { signIn } = useAuth()
  const {
    getUser,
    displayAuthorizationProcess,
    setDisplayAuthorizationProcess,
  } = useUserAuthContext()

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
            disabled={isReconnecting}
            isLoading={isReconnecting}
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
          <SignInForm onLoginSuccess={signIn} isLoading={isReconnecting} />
          <OrDivider text="or" />
          <Button
            variant="ghost"
            size="lg"
            onClick={handleGoogleSignin}
            disabled={isPending}
          >
            <Providers.Google size={20} className="mr-2" />
            Signin with Google
          </Button>
        </DialogContent>
      </Dialog>

      {displayAuthorizationProcess && (
        <AuthorizationProcess
          isOpen={displayAuthorizationProcess}
          onClose={() => setDisplayAuthorizationProcess(false)}
          user={getUser()}
        />
      )}
    </>
  )
}
