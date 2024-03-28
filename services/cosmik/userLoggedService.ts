import { cosmikClient } from "@/lib/clients"
import { useQuery } from "@tanstack/react-query"

export type GetCosmikLoggedResponse = {
  data: any | undefined
  isFetching: boolean
  isFetched: boolean
}

export function useUserIsLogged() {
  const {
    data: userLogged,
    isFetching: isFetchingUserLogged,
    isFetched: isUserLoggedFetched,
  }: GetCosmikLoggedResponse = useQuery({
    queryKey: ["cosmik", "logged"],
    queryFn: async () => {
      const response = await cosmikClient.get("/auth/authenticated")
      if (response.status === 200) {
        return response.data
      }
    },
    retry: false,
  })

  return {
    userLogged,
    isFetchingUserLogged,
    isUserLoggedFetched,
  }
}
