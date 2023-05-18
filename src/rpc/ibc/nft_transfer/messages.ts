import { EncodeObject, GeneratedType } from '@cosmjs/proto-signing'
import { MsgTransfer, MsgTransferResponse } from './tx'

export const typeUrlIBCMsgTransferNFT =
  '/ibc.applications.nft_transfer.v1.MsgTransfer'
export const typeUrlIBCMsgTransferNFTResponse =
  '/ibc.applications.nft_transfer.v1.MsgTransferResponse'
export const ibcNFTTransferTypes: ReadonlyArray<[string, GeneratedType]> = [
  [typeUrlIBCMsgTransferNFT, MsgTransfer],
  [typeUrlIBCMsgTransferNFTResponse, MsgTransferResponse],
]

export interface IBCMsgTransferNFTEncodeObject extends EncodeObject {
  readonly typeUrl: '/ibc.applications.nft_transfer.v1.MsgTransfer'
  readonly value: Partial<MsgTransfer>
}

export function isIBCMsgTransferNFTEncodeObject(
  encodeObject: EncodeObject
): encodeObject is IBCMsgTransferNFTEncodeObject {
  return (
    (encodeObject as IBCMsgTransferNFTEncodeObject).typeUrl ===
    typeUrlIBCMsgTransferNFT
  )
}

export interface IBCMsgTransferNFTResponseEncodeObject extends EncodeObject {
  readonly typeUrl: '/ibc.applications.nft_transfer.v1.MsgTransferResponse'
  readonly value: Partial<MsgTransferResponse>
}

export function isIBCMsgTransferNFTResponseEncodeObject(
  encodeObject: EncodeObject
): encodeObject is IBCMsgTransferNFTResponseEncodeObject {
  return (
    (encodeObject as IBCMsgTransferNFTResponseEncodeObject).typeUrl ===
    typeUrlIBCMsgTransferNFTResponse
  )
}
