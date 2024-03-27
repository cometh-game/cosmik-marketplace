import { useUserAuthContext } from "@/providers/userAuth"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { SigninDropdown } from "./account-dropdown/SigninDropdown"

export function AuthenticationButton({
  children,
  fullVariant = false,
  customText = undefined,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
}) {
  const { userIsReconnecting, userIsFullyConnected } = useUserAuthContext()
  if (userIsFullyConnected && !children) return <CurrentAccountDropdown />

  if (!userIsFullyConnected) {
    return (
      <SigninDropdown
        isReconnecting={userIsReconnecting}
        fullVariant={fullVariant}
        customText={customText}
      />
    )
  }

  return children
}
