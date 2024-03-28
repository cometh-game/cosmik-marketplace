export const generateRandomUint256 = () => {
  const array = new Uint8Array(32) // 32 bytes for Uint256
  crypto.getRandomValues(array)
  const randomUint256 = Array.from(array, (byte) =>
    ("0" + (byte & 0xff).toString(16)).slice(-2)
  ).join("")
  return "0x" + randomUint256
}
