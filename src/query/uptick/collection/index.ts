import request from '@/utils/request'

export interface Pagination {
  next_key: string
  total: number
}
export interface Denom {
  id: string
  name: string
  schema: string
  creator: string
  symbol: string
  mint_restricted: boolean
  update_restricted: boolean
  description: string
  uri: string
  uri_hash: string
  data: string
}
export interface DenomsReponse {
  denoms: Denom[]
  pagination: Pagination
}
export async function getDenoms(baseUrl: string): Promise<DenomsReponse> {
  const path = '/uptick/collection/nft/denoms'
  const response: DenomsReponse = await request.get(baseUrl, path)
  return response
}
