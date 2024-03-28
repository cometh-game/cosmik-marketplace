import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { LayoutGridIcon, TagIcon, UserIcon } from "lucide-react"
import { useAccount } from "wagmi"

import { useNFTFilters } from "@/lib/utils/nftFilters"
import { Button } from "@/components/ui/Button"
import { cx } from "class-variance-authority"

export type NFTStateFilterItemProps = {
  label: string
  isOnSale?: boolean
  isSelected?: boolean
  iconComponent?: React.ReactNode
}

const NFTStateFilterItem = ({
  label,
  isOnSale,
  isSelected = false,
  iconComponent = undefined,
}: NFTStateFilterItemProps) => {
  const { update } = useNFTFilters()
  return (
    <Button
      onClick={() => update({ isOnSale })}
      variant={isSelected ? "default" : "ghost"}
      className={cx("font-medium", isSelected ? "bg-accent-foreground text-accent-foreground after:content-none" : "hover:text-accent-foreground")}
    >
      {iconComponent ? iconComponent : ""}
      {label}
    </Button>
  )
}

type NFTStateFiltersProps = {
  assets: any[]
  results: number | null
}

export function NFTStateFilters({ results }: NFTStateFiltersProps) {
  const { get } = useSearchParams()
  const pathname = usePathname()
  const account = useAccount()
  const viewerAddress = account.address

  const isOnProfilePage = pathname.includes(`/profile`)

  return (
    <div className="flex gap-5 overflow-x-auto pb-1 max-md:-mx-4 max-md:px-4">
      <NFTStateFilterItem
        label={`All items`}
        isSelected={!get("isOnSale")}
        iconComponent={<LayoutGridIcon size="16" className="mr-2" />}
      />
      <NFTStateFilterItem
        label="On Sale"
        isOnSale
        isSelected={Boolean(get("isOnSale"))}
        iconComponent={<TagIcon size="16" className="mr-2" />}
      />
      {viewerAddress && !isOnProfilePage && (
        <Link href={`/profile/${viewerAddress}`}>
          <NFTStateFilterItem
            label="My collectibles"
            iconComponent={<UserIcon size="16" className="mr-2" />}
          />
        </Link>
      )}
    </div>
  )
}
