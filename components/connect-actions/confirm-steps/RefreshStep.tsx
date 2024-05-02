import { useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import Bugsnag from "@bugsnag/js"

import { Button } from "@/components/ui/Button"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { User } from "@/services/cosmik/signinService"

export type RefreshStepProps = {
  user: User
  // userAddress: string
  onValid: () => void
}

export const RefreshStep: React.FC<RefreshStepProps> = ({
  user,
  // userAddress,
  onValid,
}) => {
  const { retrieveWalletAddress } = useConnectComethWallet()
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await retrieveWalletAddress(user.address)
      toast({
        title: "Device succesfully Authorized!",
        description:
          "Your Cosmik Battle account has been successfully linked to the marketplace.",
        variant: "default",
      })
      onValid()
    } catch (error: any) {
      console.log("Error on refreshing", error?.message)
      Bugsnag.addOnError(function (event) {
        event.context = "User Login - Refresh Authorization Request"
        event.addMetadata("user", user)
      })
      toast({
        title: "Something went wrong",
        description: "Please try again",
        // variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="text-muted-foreground">
        Please log-in to Cosmik Battle (the game) and validate this device to
        retrieve your items. Once this device is validated, please press refresh
        to update your inventory.
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
