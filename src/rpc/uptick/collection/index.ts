import { QueryClient } from '@cosmjs/stargate'
import {
  QueryCollectionRequest,
  QueryCollectionResponse,
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
