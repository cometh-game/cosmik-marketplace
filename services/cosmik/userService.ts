import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ethers } from "ethers"

import { cosmikClient } from "@/lib/clients"

export const useGetUser = (walletAddress: string) => {
  const { data, isFetching } = useQuery({
    queryKey: ["cosmik", "user", walletAddress],
    queryFn: () =>
      cosmikClient.get(
        `/users?address=${ethers.utils.getAddress(walletAddress)}`
      ),
    retry: false,
    enabled: !!walletAddress,
  })

  return { user: data?.data, isFetching }
}

export const useUsernames = (addresses: string[]) => {
  const queryClient = useQueryClient()

  const queryKey = ["cosmik", "usernames"]

  const allUsernames =
    queryClient.getQueryData<Record<string, string | undefined>>(queryKey) || {}

  const uniqueAddresses = [...new Set(addresses)]
  // filter addresses to determine which are not already in cache
  const addressesToFetch = uniqueAddresses.filter((address) => {
    return (
      address.toLowerCase() !== "0x0000000000000000000000000000000000000000" &&
      !(address.toLowerCase() in allUsernames)
    )
  })

  // fetch usernames for addresses not found in cache
  const fetchUsernames = async (addresses: string[]) => {
    const response = await cosmikClient.post("/users/usernames", { addresses })
    const newUsernames = response.data.reduce(
      (
        acc: Record<string, string>,
        user: { address: string; userName: string }
      ) => {
        acc[user.address.toLowerCase()] = user.userName
        return acc
      },
      {}
    )

    // update the global cache of usernames
    const updatedUsernames = { ...allUsernames, ...newUsernames }
    queryClient.setQueryData(queryKey, updatedUsernames)

    return updatedUsernames
  }

  // use useQuery to fetch missing usernames
  const { isFetching } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchUsernames(addressesToFetch),
    enabled: addressesToFetch.length > 0,
  })

  // retrieve all usernames from cache, including new ones and filter to get only the requested usernames
  const usernames = addresses.reduce(
    (acc: Record<string, string | undefined>, address) => {
      acc[address.toLowerCase()] = allUsernames[address.toLowerCase()]
      return acc
    },
    {}
  )

  return { usernames, isFetchingUsernames: isFetching }
}
