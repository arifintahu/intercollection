import { Coin } from '@/config'
import { Balance } from '@/query/cosmos/bank'

export const templateImage = '/images/no-preview.png'

export const defaultTimeout = 300_000_000_000

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
    const first = denomId.slice(0, 14)
    const last = denomId.slice(denomId.length - 5, denomId.length)
    return first + '...' + last
  } else if (denomId.length > 20) {
    const first = denomId.slice(0, 14)
    const last = denomId.slice(denomId.length - 5, denomId.length)
    return first + '...' + last
  } else {
    return denomId
  }
}

export const trimTokenId = (tokenId: string): string => {
  if (tokenId.length > 30) {
    const first = tokenId.slice(0, 22)
    const last = tokenId.slice(tokenId.length - 5, tokenId.length)
    return first + '...' + last
  } else {
    return tokenId
  }
}

export const showBalance = (balances: Balance[], coin: Coin) => {
  const balance = balances.find((item) => item.denom === coin.minimalDenom)
  if (!balance) {
    return `0 ${coin.denom}`
  }

  const convertToDenom =
    Math.floor((balance.amount * 100) / 10 ** coin.decimals) / 100
  return `${convertToDenom.toLocaleString()} ${coin.denom}`
}

export const extractQueryPath = (asPath: string): Record<string, string> => {
  const query: Record<string, string> = {}
  const indexQuery = asPath.indexOf('?')
  if (indexQuery === -1) {
    return query
  }
  const rawQueries = asPath.slice(indexQuery + 1).split('&')
  if (!rawQueries.length) {
    return query
  }

  for (const rawQuery of rawQueries) {
    const params = rawQuery.split('=')
    if (params.length !== 2) {
      continue
    }
    query[params[0]] = decodeURIComponent(params[1])
  }

  return query
}

export const getTimeoutTimestamp = (): number => {
  const now = new Date().getTime()
  const miliToNano = 1_000_000
  return now * miliToNano + defaultTimeout
}

export const getTemplateImage = (): string => {
  let hostname: string = ''
  if (typeof window !== 'undefined') {
    hostname = window.location.hostname
  }
  return hostname.includes('github.io')
    ? '/intercollection' + templateImage
    : templateImage
}

export const getDenomHash = (denomId: string): string => {
  if (isNativeNFT(denomId)) {
    return ''
  }

  const arr = denomId.split('ibc/')
  if (arr.length != 2) {
    return ''
  }
  return arr[1]
}
