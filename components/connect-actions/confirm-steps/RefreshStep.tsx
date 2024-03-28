import { useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"
import { useUserAuthContext } from "@/providers/userAuth"

import { Button } from "@/components/ui/Button"
import { toast } from "@/components/ui/toast/hooks/useToast"

export type RefreshStepProps = {
  userAddress: string
  onValid: () => void
}

export const RefreshStep: React.FC<RefreshStepProps> = ({
  userAddress,
  onValid,
}) => {
  const { connectComethWallet, retrieveWalletAddress } =
    useConnectComethWallet()
  const { setUserIsFullyConnected } = useUserAuthContext()
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      await retrieveWalletAddress(userAddress)

      try {
        await connectComethWallet(userAddress)
        setUserIsFullyConnected(true)
        onValid()
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error?.message || "There was an error connecting your wallet.",
          variant: "destructive",
        })
      }
      toast({
        title: "Device succesfully Authorized!",
        description:
          "Your Cosmik Battle account has been successfully linked to the marketplace.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Something went wrong.",
        description: error?.message || "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="text-muted-foreground">
        Please log-in to Cosmik Battle and validate this device to retrieve your
        items. Once this device is validated, please press refresh to update
        your inventory.
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
