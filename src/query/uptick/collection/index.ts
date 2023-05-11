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

export interface NFT {
  id: string
  name: string
  owner: string
  uri: string
  uri_hash: string
  data: string
}
export interface Collection {
  denom: Denom
  nfts: NFT[]
}
export interface CollectionResponse {
  collection: Collection
  pagination: Pagination
}
export async function getCollection(
  baseUrl: string,
  denomId: string
): Promise<CollectionResponse> {
  const path = '/uptick/collection/collections/' + denomId
  const response: CollectionResponse = await request.get(baseUrl, path)
  return response
}

export interface IDCollection {
  denom_id: string
  token_ids: string[]
}

export interface Owner {
  address: string
  id_collections: IDCollection[]
}
export interface CollectionsByOwnerResponse {
  owner: Owner
  pagination: Pagination
}
export async function getCollectionsByOwner(
  baseUrl: string,
  owner: string,
  denomId?: string
): Promise<CollectionsByOwnerResponse> {
  let path = '/uptick/collection/nfts?owner=' + owner
  if (!!denomId) {
    path = path + 'denom_id=' + denomId
  }
  const response: CollectionsByOwnerResponse = await request.get(baseUrl, path)
  return response
}
