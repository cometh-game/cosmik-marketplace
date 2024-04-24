"use client"

import Image from "next/image"
import Link from "next/link"
// import { useUsername } from "@/services/user/userNameService"
import { User } from "lucide-react"
import { useWindowSize } from "usehooks-ts"
import { useAccount } from "wagmi"

import { env } from "@/config/env"
import { shortenAddress } from "@/lib/utils/addresses"
import { Button, ButtonProps } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu"

import { CopyButton } from "../ui/CopyButton"
import { AccountBalance } from "./AccountBalance"
import { AccountLogoutAction } from "./AccountLogoutAction"
import { useGetUser } from "@/services/cosmik/userService"

export type AccountDropdownProps = {
  buttonVariant?: ButtonProps["variant"]
  isolated?: boolean
}

export function CurrentAccountDropdown({
  buttonVariant,
}: AccountDropdownProps) {
  const account = useAccount()
  const viewerAddress = account.address
  const { width } = useWindowSize()
  // const { username, isFetchingUsername } = useUsername(viewerAddress as string)
  const { user, isFetching: isFetchingUsername } = useGetUser(viewerAddress as string)

  const isMobile = width < 640

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={isMobile ? "icon" : "default"} variant={buttonVariant}>
          <User size="18" className="md:mr-1" />
          {!isMobile && (isFetchingUsername ? (
                    <span>...</span>
                  ) : (
                    <span>@{user.userName}</span>
                  ))}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent variant="dialog" align="end" asChild>
        <Card className="p-4" style={{ width: "324px" }}>
          <CardHeader className="mb-2 space-y-0 p-0">
            <AccountLogoutAction />
            <div className="flex items-center gap-2">
              <Image
                src={`${env.NEXT_PUBLIC_BASE_PATH}/cometh-connect.png`}
                alt=""
                width={40}
                height={40}
              />
              <Link href={`/profile/${viewerAddress}`} className="group">
                <div className="relative -mb-0.5 text-base font-bold uppercase">
                 My account
                </div>
                {viewerAddress && (
                  <div className="text-accent mr-2 text-sm font-medium transition-colors group-hover:text-white">
                    {shortenAddress(viewerAddress, 4)}
                  </div>
                )}
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <AccountBalance />
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
