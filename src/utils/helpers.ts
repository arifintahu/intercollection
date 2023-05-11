export const templateImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'

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

export const isJSON = (str: string): boolean => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

export const trimAddress = (address: string): string => {
  const indexPrefix = address.indexOf('1')
  const first = address.slice(0, indexPrefix + 2)
  const last = address.slice(address.length - 5, address.length)
  return first + '...' + last
}

export const trimDenom = (denomId: string): string => {
  if (denomId.startsWith('ibc/')) {
    const first = denomId.slice(0, 10)
    const last = denomId.slice(denomId.length - 5, denomId.length)
    return first + '...' + last
  } else if (denomId.length > 18) {
    const first = denomId.slice(0, 14)
    const last = denomId.slice(denomId.length - 3, denomId.length)
    return first + '...' + last
  } else {
    return denomId
  }
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
