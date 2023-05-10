import request from '@/utils/request'

export interface Pagination {
  next_key: string
  total: number
}
export interface Balance {
  denom: string
  amount: number
}
export interface BalancesResponse {
  balances: Balance[]
  pagination: Pagination
}
export async function getBalances(
  baseUrl: string,
  address: string
): Promise<BalancesResponse> {
  const path = '/cosmos/bank/v1beta1/balances/' + address
  const response: BalancesResponse = await request.get(baseUrl, path)
  return response
}
