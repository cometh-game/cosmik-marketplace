import React, { useState } from "react"
import { useConnectComethWallet } from "@/providers/authentication/comethConnectHooks"

import { cosmikClient } from "@/lib/clients"
import { Button } from "@/components/ui/Button"
import { toast } from "@/components/ui/toast/hooks/useToast"

export type RequestAuthorizationStepProps = {
  userAddress: string
  onValid: () => void
}

export const RequestAuthorizationStep: React.FC<
  RequestAuthorizationStepProps
> = ({ userAddress, onValid }) => {
  const { initNewSignerRequest } = useConnectComethWallet()
  const [isLoading, setIsLoading] = useState(false)

  const handleNewSignerRequest = async () => {
    setIsLoading(true)
    try {
      const signerRequest = await initNewSignerRequest(userAddress)
      const response = await cosmikClient.post(
        "new-signer-request",
        signerRequest
      )
      if (response.data.success) {
        onValid()
      }
    } catch (error: any) {
      toast({
        title: "Error sending the authorization request",
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
        The Cosmik Battle marketplace requires permission to access your
        collectible items. This will allow you to manage them directly from the
        markertplace. This step is mandatory to link to your Cosmik Battle
        account.
      </p>
      <Button
        size="lg"
        onClick={handleNewSignerRequest}
        isLoading={isLoading}
        disabled={isLoading}
      >
        Request Authorization
      </Button>
    </>
  )
}
