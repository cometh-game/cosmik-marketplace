import { useUserAuthContext } from "@/providers/userAuth"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { SigninDropdown } from "./account-dropdown/SigninDropdown"
import { Button } from "./ui/Button"

export function AuthenticationButton({
  children,
  fullVariant = false,
  customText = undefined,
  hideIcon = false,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
  hideIcon?: boolean
} & React.ComponentProps<typeof Button>) {
  const { userIsReconnecting, userIsFullyConnected } = useUserAuthContext()

  if (userIsFullyConnected && !children) return <CurrentAccountDropdown />

  if (!userIsFullyConnected) {
    return (
      <SigninDropdown
        isReconnecting={userIsReconnecting}
        fullVariant={fullVariant}
        customText={customText}
        hideIcon={hideIcon}
      />
    )
  }

  return children
}
