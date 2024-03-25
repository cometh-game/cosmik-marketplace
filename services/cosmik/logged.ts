import { cosmikClient } from "@/services/clients"
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"

export type GetCosmikLoggedResponse = {
  // data: AxiosResponse<{ success: boolean }> | undefined
  data: {} | undefined,
  isLoading: boolean
  isFetched: boolean
}

export function useCosmikLogged() {
  const {
    data: userLogged,
    isLoading: isFetchingUserLogged,
    isFetched: isUserLoggedFetched,
  }: GetCosmikLoggedResponse = useQuery({
    queryKey: ["cosmik", "logged"],
    queryFn: async () => {
      const response = await cosmikClient.get("/auth/authenticated")
      if (response.status === 200) {
        return response.data
      }
    },
    retry: true,
  })

  return {
    userLogged: userLogged,
    isFetchingUserLogged,
    isUserLoggedFetched,
  }
}
