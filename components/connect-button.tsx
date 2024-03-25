import { useWeb3OnboardContext } from "@/providers/web3-onboard"

import { Button } from "@/components/ui/button"

import { CurrentAccountDropdown } from "./account-dropdown/current-account-dropdown"
import { SigninDropdown } from "./account-dropdown/signin-dropdown"

export function ConnectButton({
  children,
  fullVariant = false,
  customText = undefined,
  isLinkVariant = undefined,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
  isLinkVariant?: boolean
}) {
  const { isConnected, reconnecting } = useWeb3OnboardContext()

  if (isConnected && !children) return <CurrentAccountDropdown />

  if (reconnecting && !isLinkVariant) {
    return (
      <Button
        size={fullVariant ? "lg" : "default"}
        isLoading={reconnecting}
        disabled={reconnecting}
      >
        <span className="max-sm:hidden">Reconnecting</span>
        <span className="sm:hidden">Login</span>
      </Button>
    )
  }

  if (!isConnected || reconnecting) {
    return (
      <SigninDropdown
        disabled={reconnecting}
        fullVariant={fullVariant}
        customText={customText}
        isLinkVariant={isLinkVariant}
      />
    )
  }

  return <>{children}</>
}
