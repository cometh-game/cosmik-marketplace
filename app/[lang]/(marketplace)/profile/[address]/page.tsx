"use client"

import { useAttributeFilters } from "@/services/cometh-marketplace/filtersService"
import { useUsername } from "@/services/user/userNameService"
import { ArrowLeftIcon, UserIcon } from "lucide-react"
import { Address } from "viem"

import { shortenAddress } from "@/lib/utils/addresses"
import { Button } from "@/components/ui/Button"
import { CopyButton } from "@/components/ui/CopyButton"
import { Link } from "@/components/ui/Link"
import { ShareButton } from "@/components/ui/ShareButton"
import { AccountAssetActivities } from "@/components/activities/account/tabs/AccountAssetActivities"
import { AssetsSearchGrid } from "@/components/marketplace/grid/AssetSearchGrid"

export default function ProfilePage({
  params,
}: {
  params: { address: Address }
}) {
  const attributesFilters = useAttributeFilters()
  const { username, isFetchingUsername } = useUsername(params.address)
  const user =
    username && !isFetchingUsername
      ? `@${username}`
      : shortenAddress(params.address)

  if (!attributesFilters) {
    return null
  }

  return (
    <div className="container mx-auto flex w-full flex-col items-start gap-4 py-4 max-sm:pt-4">
      <Link href={`/nfts`}>
        <Button variant="secondary" className="gap-1.5 text-base">
          <ArrowLeftIcon size="16" />
          Back to marketplace
        </Button>
      </Link>
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="inline-flex items-center text-2xl font-semibold tracking-tight sm:text-3xl">
            <UserIcon size="28" className="mr-2" />
            Profile {user}
          </h1>
          <CopyButton
            label="Copy wallet address"
            size="sm"
            textToCopy={params.address}
          />
        </div>
        <ShareButton textToShow={`Check my assets on`} />
      </div>
      <AccountAssetActivities walletAddress={params.address}>
        <AssetsSearchGrid
          filteredBy={{ owner: params.address }}
          filters={attributesFilters}
        />
      </AccountAssetActivities>
    </div>
  )
}
