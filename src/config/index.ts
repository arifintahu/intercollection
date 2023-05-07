import config from './config.json'

export interface Chain {
  readonly chainId: string
  readonly description: string
  readonly rpc: string
  readonly rest: string
  readonly jsonRpc: string
}
export interface Config {
  chains: Chain[]
}

export function getConfig(): Config {
  return config
}

export function getChain(chainId: string): Chain | undefined {
  return getConfig().chains.find((item) => item.chainId == chainId)
}
