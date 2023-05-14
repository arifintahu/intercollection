/* eslint-disable */
import Long from 'long'
import * as _m0 from 'protobufjs/minimal'
export const protobufPackage = 'uptick.collection.v1'
/** MsgTransferNFT defines an SDK message for transferring an NFT to recipient. */
export interface MsgTransferNFT {
  id: string
  denomId: string
  name: string
  uri: string
  data: string
  sender: string
  recipient: string
  uriHash: string
}

/** MsgTransferNFTResponse defines the Msg/TransferNFT response type. */
export interface MsgTransferNFTResponse {}

function createBaseMsgTransferNFT(): MsgTransferNFT {
  return {
    id: '',
    denomId: '',
    name: '',
    uri: '',
    data: '',
    sender: '',
    recipient: '',
    uriHash: '',
  }
}

export const MsgTransferNFT = {
  encode(
    message: MsgTransferNFT,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id)
    }
    if (message.denomId !== '') {
      writer.uint32(18).string(message.denomId)
    }
    if (message.name !== '') {
      writer.uint32(26).string(message.name)
    }
    if (message.uri !== '') {
      writer.uint32(34).string(message.uri)
    }
    if (message.data !== '') {
      writer.uint32(42).string(message.data)
    }
    if (message.sender !== '') {
      writer.uint32(50).string(message.sender)
    }
    if (message.recipient !== '') {
      writer.uint32(58).string(message.recipient)
    }
    if (message.uriHash !== '') {
      writer.uint32(66).string(message.uriHash)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgTransferNFT {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgTransferNFT()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break
        case 2:
          message.denomId = reader.string()
          break
        case 3:
          message.name = reader.string()
          break
        case 4:
          message.uri = reader.string()
          break
        case 5:
          message.data = reader.string()
          break
        case 6:
          message.sender = reader.string()
          break
        case 7:
          message.recipient = reader.string()
          break
        case 8:
          message.uriHash = reader.string()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): MsgTransferNFT {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      denomId: isSet(object.denomId) ? String(object.denomId) : '',
      name: isSet(object.name) ? String(object.name) : '',
      uri: isSet(object.uri) ? String(object.uri) : '',
      data: isSet(object.data) ? String(object.data) : '',
      sender: isSet(object.sender) ? String(object.sender) : '',
      recipient: isSet(object.recipient) ? String(object.recipient) : '',
      uriHash: isSet(object.uriHash) ? String(object.uriHash) : '',
    }
  },

  toJSON(message: MsgTransferNFT): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.denomId !== undefined && (obj.denomId = message.denomId)
    message.name !== undefined && (obj.name = message.name)
    message.uri !== undefined && (obj.uri = message.uri)
    message.data !== undefined && (obj.data = message.data)
    message.sender !== undefined && (obj.sender = message.sender)
    message.recipient !== undefined && (obj.recipient = message.recipient)
    message.uriHash !== undefined && (obj.uriHash = message.uriHash)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgTransferNFT>, I>>(
    object: I
  ): MsgTransferNFT {
    const message = createBaseMsgTransferNFT()
    message.id = object.id ?? ''
    message.denomId = object.denomId ?? ''
    message.name = object.name ?? ''
    message.uri = object.uri ?? ''
    message.data = object.data ?? ''
    message.sender = object.sender ?? ''
    message.recipient = object.recipient ?? ''
    message.uriHash = object.uriHash ?? ''
    return message
  },
}

function createBaseMsgTransferNFTResponse(): MsgTransferNFTResponse {
  return {}
}

export const MsgTransferNFTResponse = {
  encode(
    _: MsgTransferNFTResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgTransferNFTResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseMsgTransferNFTResponse()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(_: any): MsgTransferNFTResponse {
    return {}
  },

  toJSON(_: MsgTransferNFTResponse): unknown {
    const obj: any = {}
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<MsgTransferNFTResponse>, I>>(
    _: I
  ): MsgTransferNFTResponse {
    const message = createBaseMsgTransferNFTResponse()
    return message
  },
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never
    }

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
