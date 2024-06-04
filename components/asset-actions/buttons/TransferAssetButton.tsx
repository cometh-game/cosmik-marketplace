"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import erc1155Abi from "@/abis/erc1155Abi"
import {
  useAssetOwnedQuantity,
  useIsViewerAnOwner,
} from "@/services/cometh-marketplace/assetOwners"
import {
  AssetWithTradeData,
  SearchAssetWithTradeData,
} from "@cometh/marketplace-sdk"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"
import { useAssetIs1155 } from "@/components/erc1155/ERC1155Hooks"
import TokenQuantityInput from "@/components/erc1155/TokenQuantityInput"
import { useInvalidateAssetQueries } from "@/components/marketplace/asset/AssetDataHook"
import { AssetHeaderImage } from "@/components/marketplace/asset/AssetHeaderImage"

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
  const [quantity, setQuantity] = useState(BigInt(1))

  const isErc1155 = useAssetIs1155(asset)
  const assetOwnedQuantity = useAssetOwnedQuantity(asset)
  const isViewerAnOwner = useIsViewerAnOwner(asset)
  const invalidateAssetQueries = useInvalidateAssetQueries()

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
    if (!isErc1155) {
      writeContract({
        address: asset.contractAddress as Address,
        abi: erc721Abi,
        functionName: "safeTransferFrom",
        args: [
          viewerAddress as Address,
          receiverAddress as Address,
          BigInt(asset.tokenId),
        ],
      })
    } else {
      writeContract({
        address: asset.contractAddress as Address,
        abi: erc1155Abi,
        functionName: "safeTransferFrom",
        args: [
          viewerAddress as Address,
          receiverAddress as Address,
          BigInt(asset.tokenId),
          quantity,
          "0x",
        ],
      })
    }
  }, [
    viewerAddress,
    asset.contractAddress,
    receiverAddress,
    asset.tokenId,
    writeContract,
    isErc1155,
    quantity,
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
  }, [
    isConfirmed,
    invalidateAssetQueries,
    asset.contractAddress,
    asset.owner,
    asset.tokenId,
  ])

  if (!isViewerAnOwner) return null

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary" className="mr-2">
                <SendHorizonal size={16} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm font-bold">Transfer asset</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asset transfer</DialogTitle>
        </DialogHeader>
        <div className="flex w-full justify-center">
          <AssetHeaderImage
            asset={asset}
            classNames={{
              image: "p-0",
            }}
          />
        </div>
        <div className="text-muted-foreground">
          <p className="mb-2">
            Attention pilot! You’re about to transfer a Digital Collectible to
            another wallet.{" "}
            <span className="font-semibold">
              Please make sure that the recipient address is compatible with the
              Muster Network
            </span>{" "}
            before proceeding with the transfer. <br />
            For more information, please visit :
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
        <div className="flex flex-col gap-2">
          <Label htmlFor="transfer-address">Transfer asset to address:</Label>
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
        {isErc1155 && (
          <TokenQuantityInput
            max={BigInt(assetOwnedQuantity)}
            label="Quantity to transfer*"
            onChange={setQuantity}
            initialQuantity={BigInt(1)}
          />
        )}
        <Button
          size="lg"
          disabled={
            !receiverAddressValidation.success || isConfirming || isPending
          }
          isLoading={isConfirming || isPending}
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
