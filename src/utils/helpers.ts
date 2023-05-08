export const isNativeNFT = (id: string): boolean => {
  if (id.startsWith('ibc')) {
    return false
  }
  return true
}

export const isURL = (uri: string): boolean => {
  if (!uri.startsWith('http')) {
    return false
  }
  return true
}
