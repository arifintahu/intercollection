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

export const trimAddress = (address: string): string => {
  const indexPrefix = address.indexOf('1')
  const first = address.slice(0, indexPrefix + 2)
  const last = address.slice(address.length - 5, address.length)
  return first + '...' + last
}

export const showBalance = (denom: string, amount: number) => {
  if (denom.startsWith('a')) {
    return `${Math.round((amount * 100) / 10 ** 18) / 100} ${denom
      .slice(1)
      .toUpperCase()}`
  }
  if (denom.startsWith('u')) {
    return `${Math.round((amount * 100) / 10 ** 6) / 100} ${denom
      .slice(1)
      .toUpperCase()}`
  }
  return ''
}
