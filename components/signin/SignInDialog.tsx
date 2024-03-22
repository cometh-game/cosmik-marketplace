import Image from "next/image"
import { User } from "@/services/cosmik/signinService"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/Dialog"

import { SignInForm } from "./SignInForm"

type SignInFormProps = {
  onLoginSuccess: (user: User) => void
}

export function SignInDialog({ onLoginSuccess }: SignInFormProps) {
  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-[400px]" shouldDisplayCloseBtn={false}>
        <DialogHeader>
          <Image
            className="mx-auto"
            src="/cosmik-logo.png"
            width="140"
            height="70"
            alt=""
          />
        </DialogHeader>
        <DialogDescription>
          Enter your Cosmik Battle credentials to view or add external wallets
        </DialogDescription>
        <SignInForm onLoginSuccess={onLoginSuccess}  />
      </DialogContent>
    </Dialog>
  )
}
