"use client"

import { ComponentProps, memo, useMemo } from "react"
import { User } from "lucide-react"

import { cn } from "@/lib/utils/utils"

import { Link } from "../Link"
import { useContent } from "./hooks/useContent"
import { UserButtonProps } from "./UserButton"

export const UserLink = memo(function UserLink({
  user,
  className,
  hideIcon,
  forceDisplayAddress = false,
  ...rest
}: Omit<UserButtonProps, "icon"> &
  Omit<ComponentProps<typeof Link>, "href"> & {
    hideIcon?: boolean
    forceDisplayAddress?: boolean
  }) {
  const content = useContent(user, forceDisplayAddress)

  const userProfileHref = useMemo(() => {
    return `/profile/${user.address}`
  }, [user])

  return (
    <Link
      {...rest}
      href={userProfileHref}
      className={cn("flex items-center text-lg font-medium", className)}
    >
      {!hideIcon && <User className="mr-2 size-4" />} {content}
    </Link>
  )
})