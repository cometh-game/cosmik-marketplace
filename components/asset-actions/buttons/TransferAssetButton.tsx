"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useGetUser } from "@/services/cosmik/userService"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
import { useQueryClient } from "@tanstack/react-query"
import { SendHorizonal } from "lucide-react"
import { Address, erc721Abi } from "viem"
import {
  BaseError,
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { z } from "zod"

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { toast } from "@/components/ui/toast/hooks/useToast"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/Tooltip"

type Inputs = {
  example: string
  exampleRequired: string
}

type TransferAssetButtonProps = {
  asset: SearchAssetWithTradeData | AssetWithTradeData
  verifyAddress?: boolean
} & React.ComponentProps<typeof Button>

const addressSchema = z
  .string()
  .length(42, "Address must be 42 characters long.")
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Invalid address. Must be a valid Ethereum address."
  )

export function TransferAssetButton({
  asset,
  verifyAddress = true,
  ...buttonProps
}: TransferAssetButtonProps) {
  const [receiverAddress, setReceiverAddress] = useState("")
  const [isPristine, setIsPristine] = useState(true)
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const [open, setOpen] = useState(false)
  const client = useQueryClient()
  const invalidateAssetQueries = useInvalidateAssetQueries()
  const { user: receiverUser, isFetching: isFetchingReceiverUser } =
    useGetUser(receiverAddress)
  const account = useAccount()
  const viewerAddress = account.address

  const receiverAddressValidation = useMemo(() => {
    const urlParseRes = addressSchema.safeParse(receiverAddress)
    return urlParseRes
  }, [receiverAddress])

  const onReceiverAddressChange = useCallback((newAddress: string) => {
    setReceiverAddress(newAddress)
    setIsPristine(false)
  }, [])

  const transferAsset = useCallback(() => {
    if (!viewerAddress) return
    if (verifyAddress && !receiverUser) {
      toast({
        title: "Receiver address not found",
        description:
          "This address is not valid or does not have a Cosmik account.",
        variant: "destructive",
      })
      return
    }
    writeContract({
      address: asset.contractAddress as Address,
      abi: erc721Abi,
      functionName: "safeTransferFrom",
      args: [
        asset.owner as Address,
        receiverAddress as Address,
        BigInt(asset.tokenId),
      ],
    })
  }, [
    viewerAddress,
    verifyAddress,
    receiverUser,
    writeContract,
    asset.contractAddress,
    asset.owner,
    asset.tokenId,
    receiverAddress,
  ])

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Transfer confirmed",
      })
      setOpen(false)
      invalidateAssetQueries(
        asset.contractAddress as Address,
        asset.tokenId,
        asset.owner
      )
    }
  }, [isConfirmed, asset.tokenId, client, setOpen, invalidateAssetQueries])

  const isViewerNotOwner = useMemo(() => {
    return (
      !asset.owner ||
      !viewerAddress ||
      asset.owner.toLowerCase() !== viewerAddress.toLowerCase()
    )
  }, [asset.owner, viewerAddress])

  if (isViewerNotOwner) return null

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <TooltipProvider delayDuration={200}>
          <Tooltip defaultOpen={false}>
            <TooltipTrigger asChild>
              <Button size="sm" variant="secondary" className="mr-2">
                <SendHorizonal size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm font-bold">Transfer asset</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asset transfer</DialogTitle>
        </DialogHeader>
        <div className="flex w-full items-center justify-center">
          <AssetHeaderImage asset={asset} />
        </div>
        <div className="text-muted-foreground">
          <p className="mb-2">
            Attention pilot! You’re about to transfer a Digital Collectible to
            another wallet.{" "}
            <span className="font-semibold">
              Please make sure that the recipient address is compatible with the
              Muster Network
            </span>{" "}
            before proceeding with the transfer. For more information, please
            visit :
          </p>
          <ul className="ml-5 list-disc">
            <li>
              <a
                href="https://www.cosmikbattle.com/cosmik-academy/wallet-management"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-foreground font-medium underline transition-colors"
              >
                Wallet Management
              </a>
            </li>
            <li>
              <a
                href="https://www.cosmikbattle.com/cosmik-academy/marketplace-gettingready"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent-foreground font-medium underline transition-colors"
              >
                Marketplace Getting Ready
              </a>
            </li>
          </ul>
        </div>
        <div className="">
          <Label htmlFor="transfer-address" className="mb-0.5">
            Transfer asset to address:
          </Label>
          <Input
            id="transfer-address"
            placeholder="0x1a..."
            inputUpdateCallback={onReceiverAddressChange}
          />
          {!isPristine && !receiverAddressValidation.success && (
            <div className="mt-1 text-sm text-red-500">
              {receiverAddressValidation.error.issues[0].message}
            </div>
          )}
        </div>
        <Button
          size="lg"
          disabled={
            !receiverAddressValidation.success ||
            isConfirming ||
            isPending ||
            isFetchingReceiverUser
          }
          isLoading={isConfirming || isPending || isFetchingReceiverUser}
          onClick={transferAsset}
        >
          {isConfirming || isPending
            ? "Transferring asset..."
            : "Transfer asset"}
        </Button>
        {(error || isConfirmed) && (
          <div className="mt-2">
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
              <div>
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
