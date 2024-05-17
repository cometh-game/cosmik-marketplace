import { ComponentProps } from "react"
import NextLink from "next/link"

import { cn } from "@/lib/utils/utils"

export const Link = ({
  className,
  ...props
}: ComponentProps<typeof NextLink>) => (
  <NextLink
    className={cn(
      "inline text-base font-medium text-white/80 hover:text-white",
      className
    )}
    {...props}
  />
)
