import { useEffect, useState } from "react"

export function useStorageWallet() {
  const [comethWalletAddressInStorage, setComethWalletAddressInStorage] =
    useState<string | null>(null)

  useEffect(() => {
    const keysInStorage = Object.keys(localStorage)
    for (let key of keysInStorage) {
      if (key.startsWith("cometh-connect")) {
        const keyParts = key.split("-")
        const address = keyParts[keyParts.length - 1]
        setComethWalletAddressInStorage(address)
        break
      }
    }
  }, [])

  return {
    comethWalletAddressInStorage,
  }
}

export function useWalletAddressFromStorage() {
  const [walletAddressFromStorage, setWalletAddressFromStorage] =
    useState<string | null>(null)

  useEffect(() => {
    const currentWalletAddress = localStorage.getItem("currentWalletAddress")
    if (currentWalletAddress) {

      setWalletAddressFromStorage(currentWalletAddress)
    }
  }, [])

  return {
    walletAddressFromStorage,
  }
}

// export function useRetrieveWalletAddress() {
//   const [
//     hasRetrieveWalletAddressInStorage,
//     setHasRetrieveWalletAddressInStorage,
//   ] = useState<boolean>(false)

//   useEffect(() => {
//     const hasRetrieveWalletAddress = localStorage.getItem(
//       "hasRetrieveWalletAddress"
//     )
//     if (hasRetrieveWalletAddress === "true") {
//       setHasRetrieveWalletAddressInStorage(true)
//     }
//   }, [])

//   return {
//     hasRetrieveWalletAddressInStorage,
//   }
// }