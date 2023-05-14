import { EncodeObject, GeneratedType } from '@cosmjs/proto-signing'
import { MsgTransferNFT, MsgTransferNFTResponse } from './tx'

export const typeUrlMsgTransferNFT = '/uptick.collection.v1.MsgTransferNFT'
export const typeUrlMsgTransferNFTResponse =
  '/uptick.collection.v1.MsgTransferNFTResponse'
export const uptickCollectionTypes: ReadonlyArray<[string, GeneratedType]> = [
  [typeUrlMsgTransferNFT, MsgTransferNFT],
  [typeUrlMsgTransferNFTResponse, MsgTransferNFTResponse],
]

export interface MsgTransferNFTEncodeObject extends EncodeObject {
  readonly typeUrl: '/uptick.collection.v1.MsgTransferNFT'
  readonly value: Partial<MsgTransferNFT>
}

export function isMsgTransferNFTEncodeObject(
  encodeObject: EncodeObject
): encodeObject is MsgTransferNFTEncodeObject {
  return (
    (encodeObject as MsgTransferNFTEncodeObject).typeUrl ===
    typeUrlMsgTransferNFT
  )
}

export interface MsgTransferNFTResponseEncodeObject extends EncodeObject {
  readonly typeUrl: '/uptick.collection.v1.MsgTransferNFTResponse'
  readonly value: Partial<MsgTransferNFTResponse>
}

export function isMsgTransferNFTResponseEncodeObject(
  encodeObject: EncodeObject
): encodeObject is MsgTransferNFTResponseEncodeObject {
  return (
    (encodeObject as MsgTransferNFTResponseEncodeObject).typeUrl ===
    typeUrlMsgTransferNFTResponse
  )
}
