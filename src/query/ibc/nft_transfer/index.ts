import request from '@/utils/request'

export interface ClassTrace {
  path: string
  base_class_id: number
}
export interface ClassTraceResponse {
  class_trace: ClassTrace
}
export async function getClassTrace(
  baseUrl: string,
  hash: string
): Promise<ClassTraceResponse> {
  const path = '/ibc/apps/nft_transfer/v1/class_traces/' + hash
  const response: ClassTraceResponse = await request.get(baseUrl, path)
  return response
}
