import config from './config.json'

export interface Chain {
  readonly chain_id: string
  readonly description: string
  readonly rpc: string
  readonly rest: string
  readonly json_rpc: string
}
export interface Config {
  chains: Chain[]
}

export function getChains(): Chain[] {
  return config.chains
}

export function getChain(chainId: string): Chain | null {
  const chain = config.chains.find((item) => item.chain_id == chainId)
  if (!chain) {
    return null
  }
  return chain
}
