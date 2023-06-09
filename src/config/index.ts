import config from './config.json'

export interface Coin {
  readonly denom: string
  readonly minimalDenom: string
  readonly decimals: number
}

export interface Chain {
  readonly chain_id: string
  readonly description: string
  readonly rpc: string
  readonly rest: string
  readonly json_rpc: string
  readonly is_eth_signer: boolean
  readonly gas_price: string
  readonly coin: Coin
}
export interface DestinationChain {
  readonly chain_id: string
  readonly description: string
}
export interface Channel {
  readonly src_id: string
  readonly dest_id: string
  readonly src_channel: string
}
export interface Config {
  chains: Chain[]
  destination_chains: DestinationChain[]
  channels: Channel[]
}

export function getChains(): Chain[] {
  return config.chains
}

export function getChain(chainId: string): Chain | null {
  const chain = config.chains.find((item) => item.chain_id === chainId)
  if (!chain) {
    return null
  }
  return chain
}

export function getDestinationChains(): DestinationChain[] {
  return config.destination_chains
}

export function getChannels(): Channel[] {
  return config.channels
}

export function getChannel(
  srcChainId: string,
  dstChainId: string
): Channel | null {
  const channel = config.channels.find(
    (item) => item.src_id === srcChainId && item.dest_id === dstChainId
  )
  if (!channel) {
    return null
  }
  return channel
}
