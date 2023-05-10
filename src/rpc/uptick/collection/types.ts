import {
  PageRequest,
  PageResponse,
} from 'cosmjs-types/cosmos/base/query/v1beta1/pagination'
import {
  Denom,
  Collection,
  createBaseCollection,
  Owner,
  createBaseOwner,
} from './nft'
import * as _m0 from 'protobufjs/minimal'
import { isSet, DeepPartial, Exact } from 'cosmjs-types/helpers'

export interface QueryDenomsRequest {
  pagination?: PageRequest
}

export interface QueryDenomsResponse {
  denoms: Denom[]
  pagination?: PageResponse
}

function createBaseQueryDenomsRequest(): QueryDenomsRequest {
  return {
    pagination: undefined,
  }
}

export const QueryDenomsRequest = {
  encode(
    message: QueryDenomsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim()
    }

    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDenomsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseQueryDenomsRequest()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32())
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },

  fromJSON(object: any): QueryDenomsRequest {
    return {
      pagination: isSet(object.pagination)
        ? PageRequest.fromJSON(object.pagination)
        : undefined,
    }
  },

  toJSON(message: QueryDenomsRequest): unknown {
    const obj: any = {}
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined)
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<QueryDenomsRequest>, I>>(
    object: I
  ): QueryDenomsRequest {
    const message = createBaseQueryDenomsRequest()
    message.pagination =
      object.pagination !== undefined && object.pagination !== null
        ? PageRequest.fromPartial(object.pagination)
        : undefined
    return message
  },
}

function createBaseQueryDenomsResponse(): QueryDenomsResponse {
  return {
    denoms: [],
    pagination: undefined,
  }
}

export const QueryDenomsResponse = {
  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDenomsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseQueryDenomsResponse()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.denoms.push(Denom.decode(reader, reader.uint32()))
          break

        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32())
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },

  fromJSON(object: any): QueryDenomsResponse {
    return {
      denoms: Array.isArray(object?.denoms)
        ? object.denoms.map((e: any) => Denom.fromJSON(e))
        : [],
      pagination: isSet(object.pagination)
        ? PageResponse.fromJSON(object.pagination)
        : undefined,
    }
  },

  toJSON(message: QueryDenomsResponse): unknown {
    const obj: any = {}

    if (message.denoms) {
      obj.denoms = message.denoms.map((e) => (e ? Denom.toJSON(e) : undefined))
    } else {
      obj.denoms = []
    }

    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageResponse.toJSON(message.pagination)
        : undefined)
    return obj
  },
}

export interface QueryCollectionRequest {
  denom_id: string
}

export interface QueryCollectionResponse {
  collection: Collection
}

function createBaseQueryCollectionRequest(): QueryCollectionRequest {
  return {
    denom_id: '',
  }
}

export const QueryCollectionRequest = {
  encode(
    message: QueryCollectionRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.denom_id !== undefined) {
      writer.uint32(10).string(message.denom_id)
    }

    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryCollectionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseQueryCollectionRequest()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.denom_id = reader.string()
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },

  fromJSON(object: any): QueryCollectionRequest {
    return {
      denom_id: isSet(object.denom_id) ? String(object.denom_id) : '',
    }
  },

  toJSON(message: QueryCollectionRequest): unknown {
    const obj: any = {}
    message.denom_id !== undefined && (obj.denom_id = message.denom_id)
    return obj
  },
}

export function createBaseQueryCollectionResponse(): QueryCollectionResponse {
  return {
    collection: createBaseCollection(),
  }
}

export const QueryCollectionResponse = {
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryCollectionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseQueryCollectionResponse()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.collection = Collection.decode(reader, reader.uint32())
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },
}

export interface QueryNFTsOfOwnerRequest {
  denom_id?: string
  owner: string
  pagination?: PageRequest
}

export interface QueryNFTsOfOwnerResponse {
  owner: Owner
  pagination?: PageResponse
}

function createBaseQueryNFTsOfOwnerRequest(): QueryNFTsOfOwnerRequest {
  return {
    owner: '',
  }
}

export const QueryNFTsOfOwnerRequest = {
  encode(
    message: QueryNFTsOfOwnerRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.denom_id !== undefined) {
      writer.uint32(10).string(message.denom_id)
    }

    if (message.owner !== '') {
      writer.uint32(10).string(message.owner)
    }

    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(18).fork()).ldelim()
    }

    return writer
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryNFTsOfOwnerRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseQueryNFTsOfOwnerRequest()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.denom_id = reader.string()
          break
        case 2:
          message.owner = reader.string()
          break
        case 3:
          message.pagination = PageRequest.decode(reader, reader.uint32())
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },

  fromJSON(object: any): QueryNFTsOfOwnerRequest {
    return {
      denom_id: isSet(object.denom_id) ? String(object.denom_id) : '',
      owner: isSet(object.owner) ? String(object.owner) : '',
      pagination: isSet(object.pagination)
        ? PageRequest.fromJSON(object.pagination)
        : undefined,
    }
  },

  toJSON(message: QueryNFTsOfOwnerRequest): unknown {
    const obj: any = {}
    message.denom_id !== undefined && (obj.denom_id = message.denom_id)
    message.owner !== undefined && (obj.owner = message.owner)
    message.pagination !== undefined &&
      (obj.pagination = message.pagination
        ? PageRequest.toJSON(message.pagination)
        : undefined)
    return obj
  },
}

export function createBaseQueryNFTsOfOwnerResponse(): QueryNFTsOfOwnerResponse {
  return {
    owner: createBaseOwner(),
    pagination: undefined,
  }
}

export const QueryNFTsOfOwnerResponse = {
  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): QueryNFTsOfOwnerResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseQueryNFTsOfOwnerResponse()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.owner = Owner.decode(reader, reader.uint32())
          break
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32())
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },
}
