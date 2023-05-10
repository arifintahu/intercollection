import { QueryClient } from '@cosmjs/stargate'
import {
  QueryCollectionRequest,
  QueryCollectionResponse,
  QueryNFTsOfOwnerRequest,
  QueryNFTsOfOwnerResponse,
} from '@/rpc/uptick/collection/types'
import { connectWebsocketClient } from '@/rpc/client'
export { Denom, NFT, Collection } from './nft'

export async function getCollection(
  rpc: string,
  denomId: string
): Promise<QueryCollectionResponse> {
  const tmClient = await connectWebsocketClient(rpc)
  const queryClient = new QueryClient(tmClient)
  const requestData = QueryCollectionRequest.encode({
    denom_id: denomId,
  }).finish()
  const { value } = await queryClient.queryAbci(
    '/uptick.collection.v1.Query/Collection',
    requestData
  )

  tmClient.disconnect()

  return QueryCollectionResponse.decode(value)
}

export async function getCollectionsByOwner(
  rpc: string,
  owner: string
): Promise<QueryNFTsOfOwnerResponse> {
  const tmClient = await connectWebsocketClient(rpc)
  const queryClient = new QueryClient(tmClient)
  const requestData = QueryNFTsOfOwnerRequest.encode({
    owner: owner,
  }).finish()
  const { value } = await queryClient.queryAbci(
    '/uptick.collection.v1.Query/NFTsOfOwner',
    requestData
  )

  tmClient.disconnect()

  return QueryNFTsOfOwnerResponse.decode(value)
}
