import { cx } from "class-variance-authority"
import { Wallet } from "lucide-react"
import { useAccount } from "wagmi"

import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
import { Button } from "./ui/Button"
import { useOpenLoginModal } from "@/providers/authentication/authenticationUiSwitch"


export function AuthenticationButton({
  children,
  fullVariant = false,
  customText = undefined,
}: {
  children?: React.ReactNode
  fullVariant?: boolean
  customText?: string
}) {
  const account = useAccount()
  const openLoginModal = useOpenLoginModal()

  if (account.isConnected && !children) return <CurrentAccountDropdown />

  if (!account.isConnected) {
    return (
      <Button
        variant="default"
        size={fullVariant ? "lg" : "default"}
        onClick={() => openLoginModal && openLoginModal()}
        isLoading={account.isReconnecting}
        disabled={account.isReconnecting}
        className={cx({
          "h-12 w-full": fullVariant,
        })}
      >
        {customText ? (
          customText
        ) : (
          <>
            <Wallet className="mr-2" size="20" />
            Login
          </>
        )}
      </Button>
    )
  }

  return children
}

// import { useEffect, useState } from "react"
// import { useWeb3OnboardContext } from "@/providers/web3-onboard"
// import { useWalletConnect } from "@/services/web3/use-wallet-connect"
// import { WalletIcon } from "lucide-react"

// import { Button } from "@/components/ui/Button"

// import { CurrentAccountDropdown } from "./account-dropdown/CurrentAccountDropdown"
// import { SigninDropdown } from "./account-dropdown/SigninDropdown"
// import { useRetrieveWalletAddress, useStorageWallet } from "@/services/web3/use-storage-wallet"

// export function ConnectButton({
//   children,
//   fullVariant = false,
//   customText = undefined,
//   isLinkVariant = undefined,
// }: {
//   children?: React.ReactNode
//   fullVariant?: boolean
//   customText?: string
//   isLinkVariant?: boolean
// }) {
//   const { initOnboard, isConnected, setIsconnected, reconnecting } = useWeb3OnboardContext()
//   const { connect: connectWallet, connecting } = useWalletConnect()
//   const [isLoading, setIsLoading] = useState(false)
//   const { comethWalletAddressInStorage } = useStorageWallet()
//   const { hasRetrieveWalletAddressInStorage } = useRetrieveWalletAddress()

//   async function handleConnect(isComethWallet = false) {
//     setIsLoading(true)
//     try {
//       initOnboard({
//         isComethWallet,
//         ...(comethWalletAddressInStorage && {
//           walletAddress: comethWalletAddressInStorage,
//         }),
//       })
//       await connectWallet({ isComethWallet })
//       setIsconnected(true)
//     } catch (error) {
//       console.error("Error connecting wallet", error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (isConnected && !children) return <CurrentAccountDropdown />

//   if (reconnecting && !isLinkVariant) {
//     return (
//       <Button
//         size={fullVariant ? "lg" : "default"}
//         isLoading={reconnecting}
//         disabled={reconnecting}
//       >
//        <span className="max-sm:hidden">Reconnecting</span>
//        <span className="sm:hidden">Login</span>
//       </Button>
//     )
//   }

//   if (
//     hasRetrieveWalletAddressInStorage && !isConnected
//   ) {
//     return (
//       <Button
//         variant="default"
//         size={fullVariant ? "lg" : "default"}
//         isLoading={isLoading || connecting || reconnecting}
//         disabled={isLoading || connecting || reconnecting}
//         onClick={() => handleConnect(true)}
//       >
//         <WalletIcon size="16" className="mr-2" />
//         Login
//       </Button>
//     )
//   }

//   if (!isConnected || isLoading || connecting) {
//     return (
//       <SigninDropdown
//         disabled={isLoading || connecting || reconnecting}
//         fullVariant={fullVariant}
//         customText={customText}
//         isLinkVariant={isLinkVariant}
//       />
//     )
//   }

//   return <>{children}</>
// }
