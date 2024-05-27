"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SendHorizonal } from "lucide-react"
import { Address, erc20Abi, parseUnits } from "viem"
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { z } from "zod"

import globalConfig from "@/config/globalConfig"
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
import { InfoBox } from "@/components/ui/MessageBox"
import { Switch } from "@/components/ui/Switch"
import { toast } from "@/components/ui/toast/hooks/useToast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip"

const addressSchema = z
  .string()
  .length(42, "Address must be 42 characters long.")
  .regex(
    /^0x[a-fA-F0-9]{40}$/,
    "Invalid address. Must be a valid Ethereum address."
  )
const amountSchema = z
  .number()
  .min(0.0000000000001, "Amount must be greater than zero.")

type ERC20TransferButtonProps = {
  tokenAddress?: string // Optional. If not provided, assume native token transfer.
  tokenSymbol: string
  decimalNumber?: number // Optional. Default to 18 if not provided or if native token transfer.
} & React.ComponentProps<typeof Button>

const ERC20TransferButton = ({
  tokenAddress,
  tokenSymbol,
  decimalNumber = 18, // Default to 18 decimals if not specified
  ...buttonProps
}: ERC20TransferButtonProps) => {
  const { push } = useRouter()
  const [receiverAddress, setReceiverAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isPristine, setIsPristine] = useState(true)
  const {
    data: txHash,
    sendTransaction,
    isPending: isPendingSendTransaction,
    isSuccess: isSuccessSendTransaction,
  } = useSendTransaction()
  const { data: hash, writeContract, error, isPending } = useWriteContract()
  const [open, setOpen] = useState(false)
  const [hasReading, setHasReading] = useState(false)

  const account = useAccount()
  const viewerAddress = account.address

  const receiverAddressValidation = useMemo(
    () => addressSchema.safeParse(receiverAddress),
    [receiverAddress]
  )
  const amountValidation = useMemo(
    () => amountSchema.safeParse(parseFloat(amount)),
    [amount]
  )

  const onReceiverAddressChange = useCallback((newAddress: string) => {
    setReceiverAddress(newAddress)
    setIsPristine(false)
  }, [])

  const onAmountChange = useCallback((newAmount: string) => {
    setAmount(newAmount)
    setIsPristine(false)
  }, [])

  const transferTokens = useCallback(() => {
    if (!viewerAddress) return

    if (tokenAddress) {
      // ERC20 token transfer
      writeContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "transfer",
        args: [receiverAddress as Address, parseUnits(amount, decimalNumber)],
      })
    } else {
      console.log("sendTransaction")
      // Native token transfer
      sendTransaction({
        to: receiverAddress as Address,
        value: parseUnits(amount, decimalNumber),
      })
    }
  }, [
    viewerAddress,
    tokenAddress,
    receiverAddress,
    amount,
    writeContract,
    sendTransaction,
    decimalNumber,
  ])

  const {
    data: tx,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash: hash || txHash })
  console.log("hash", hash)
  console.log("txHash", txHash)
  console.log("tx", tx)

  useEffect(() => {
    if (
      (tokenAddress && isConfirmed) ||
      (!tokenAddress && isSuccessSendTransaction)
    ) {
      toast({
        title: "Transfer confirmed",
        description: "You can follow the transaction on Muster explorer",
        duration: 10000000,
        action: (
          <Link
            href={`${globalConfig.network.explorer?.blockUrl}/${tx?.transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <Button size="sm">View</Button>
          </Link>
        ),
      })
      setOpen(false)
    }
  }, [
    tokenAddress,
    isConfirmed,
    isSuccessSendTransaction,
    setOpen,
    hash,
    tx?.transactionHash,
  ])

  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={200}>
        <Tooltip defaultOpen={false}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="xs" {...buttonProps}>
                Send&nbsp;
                <SendHorizonal size={14} />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent align="end">
            <p className="text-sm font-bold">
              {tokenAddress
                ? "Send Tokens " + tokenSymbol
                : "Send Native Tokens " + tokenSymbol}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {tokenAddress
              ? "Token Transfer: " + tokenSymbol
              : "Native Token Transfer: " + tokenSymbol}
          </DialogTitle>
        </DialogHeader>

        {/* <InfoBox
          title="Information"
          description={
            <div className="text-muted-foreground">
              You are about to transfer assets from your Smart Wallet to an
              external Wallet. Cosmik Battle is deployed on the Muster and
              leverages its own Account Abstraction solution. Prior to engaging
              in any wallet-related activity, please visit our wallet tutorials.
              <br />
              <br />
              <div className="flex flex-col items-center justify-center gap-1 sm:flex-row sm:gap-2">
                <a
                  href="https://www.cosmikbattle.com/cosmik-academy/wallet-management"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-foreground font-medium underline transition-colors"
                >
                  Wallet Management
                </a>
                and
                <a
                  href="https://www.cosmikbattle.com/cosmik-academy/marketplace-gettingready"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent-foreground font-medium underline transition-colors"
                >
                  Marketplace Getting Ready
                </a>
              </div>
            </div>
          }
        /> */}

        <div className="text-muted-foreground">
          <p className="mb-2">
            You are about to transfer assets from your Smart Wallet to another
            wallet. Cosmik Battle is deployed on the Muster network and
            leverages its own Account Abstraction solution. Prior to engaging in
            any wallet-related activity, please visit :
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
          {tokenAddress && (
            <div className="mb-3">
              ERC20 Token Address:{" "}
              <span className="font-bold">{tokenAddress}</span>
            </div>
          )}
          <Label htmlFor="receiver-address">Receiver Address:</Label>
          <Input
            id="receiver-address"
            placeholder="0x123..."
            inputUpdateCallback={onReceiverAddressChange}
          />
          {!isPristine && !receiverAddressValidation.success && (
            <div className="mt-1 text-sm text-red-500">
              {receiverAddressValidation.error.issues[0].message}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount:</Label>
          <Input
            id="amount"
            placeholder="Amount"
            inputUpdateCallback={onAmountChange}
          />
          {!isPristine && !amountValidation.success && (
            <div className="mt-1 text-sm text-red-500">
              {amountValidation.error.issues[0].message}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="reading"
            checked={hasReading}
            onCheckedChange={() => setHasReading(!hasReading)}
          />
          <Label htmlFor="reading" className="cursor-pointer leading-tight">
            I have reviewed the Wallet Management tutorial and understand that
            my Native Tokens will be transferred to the Receiver Address wallet
            on the Muster Network
          </Label>
        </div>

        <Button
          size="lg"
          disabled={
            !receiverAddressValidation.success ||
            !amountValidation.success ||
            isConfirming ||
            isPending ||
            isPendingSendTransaction ||
            !hasReading
          }
          isLoading={isConfirming || isPending}
          onClick={transferTokens}
        >
          {isConfirming || isPending || isPendingSendTransaction
            ? "Processing..."
            : tokenAddress
              ? "Transfer Tokens"
              : "Send Native Tokens"}
        </Button>
        {/* {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>} */}
        {error && (
          <div className="mt-2">
            <div>Error: {error.message}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ERC20TransferButton
