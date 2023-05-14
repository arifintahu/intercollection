import { Tendermint34Client, WebsocketClient } from '@cosmjs/tendermint-rpc'
export { CustomSigningStargateClient } from './signingclient'

const replaceHTTPtoWebsocket = (url: string): string => {
  return url.replace('http', 'ws')
}

export async function connectWebsocketClient(
  rpcAddress: string
): Promise<Tendermint34Client> {
  const wsUrl = replaceHTTPtoWebsocket(rpcAddress)
  const wsClient = new WebsocketClient(wsUrl)
  const tmClient = await Tendermint34Client.create(wsClient)
  return tmClient
}
