import * as _m0 from 'protobufjs/minimal'
import { isSet } from 'cosmjs-types/helpers'

export interface Denom {
  id: string
  name: string
  schema: string
  creator: string
  symbol?: string
  mint_restricted?: boolean
  update_restricted?: boolean
  description?: string
  uri?: string
  uri_hash?: string
  data?: string
}

export interface NFT {
  id: string
  name: string
  uri?: string
  data?: string
  owner: string
  uri_hash?: string
}

export interface Collection {
  denom: Denom
  nfts: NFT[]
}

export interface IDCollection {
  denom_id: string
  token_ids: string[]
}

export interface Owner {
  address: string
  id_collections: IDCollection[]
}

function createBaseDenom(): Denom {
  return {
    id: '',
    name: '',
    schema: '',
    creator: '',
    symbol: '',
    mint_restricted: false,
    update_restricted: false,
    description: '',
    uri: '',
    uri_hash: '',
    data: '',
  }
}

export const Denom = {
  decode(input: _m0.Reader | Uint8Array, length?: number): Denom {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseDenom()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break

        case 2:
          message.name = reader.string()
          break

        case 3:
          message.schema = reader.string()
          break

        case 4:
          message.creator = reader.string()
          break

        case 5:
          message.symbol = reader.string()
          break

        case 6:
          message.mint_restricted = reader.bool()
          break

        case 7:
          message.update_restricted = reader.bool()
          break

        case 8:
          message.description = reader.string()
          break

        case 9:
          message.uri = reader.string()
          break

        case 10:
          message.uri_hash = reader.string()
          break

        case 11:
          message.data = reader.string()
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },

  fromJSON(object: any): Denom {
    return {
      id: isSet(object.id) ? String(object.id) : '',
      name: isSet(object.name) ? String(object.name) : '',
      schema: isSet(object.schema) ? String(object.schema) : '',
      creator: isSet(object.creator) ? String(object.creator) : '',
      symbol: isSet(object.symbol) ? String(object.symbol) : '',
      mint_restricted: isSet(object.mint_restricted)
        ? Boolean(object.mint_restricted)
        : false,
      update_restricted: isSet(object.update_restricted)
        ? Boolean(object.update_restricted)
        : false,
      description: isSet(object.description) ? String(object.description) : '',
      uri: isSet(object.uri) ? String(object.uri) : '',
      uri_hash: isSet(object.uri_hash) ? String(object.uri_hash) : '',
      data: isSet(object.data) ? String(object.data) : '',
    }
  },

  toJSON(message: Denom): unknown {
    const obj: any = {}
    message.id !== undefined && (obj.id = message.id)
    message.name !== undefined && (obj.name = message.name)
    message.schema !== undefined && (obj.schema = message.schema)
    message.creator !== undefined && (obj.creator = message.creator)
    message.symbol !== undefined && (obj.symbol = message.symbol)
    message.mint_restricted !== undefined &&
      (obj.mint_restricted = message.mint_restricted)
    message.update_restricted !== undefined &&
      (obj.update_restricted = message.update_restricted)
    message.description !== undefined && (obj.description = message.description)
    message.uri !== undefined && (obj.uri = message.uri)
    message.uri_hash !== undefined && (obj.uri_hash = message.uri_hash)
    message.data !== undefined && (obj.data = message.data)
    return obj
  },
}

export function createBaseNFT(): NFT {
  return {
    id: '',
    name: '',
    uri: '',
    data: '',
    owner: '',
    uri_hash: '',
  }
}

export const NFT = {
  decode(input: _m0.Reader | Uint8Array, length?: number): NFT {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseNFT()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.id = reader.string()
          break

        case 2:
          message.name = reader.string()
          break

        case 3:
          message.uri = reader.string()
          break

        case 4:
          message.data = reader.string()
          break

        case 5:
          message.owner = reader.string()
          break

        case 6:
          message.uri_hash = reader.string()
          break
      }
    }

    return message
  },
}

export function createBaseCollection(): Collection {
  return {
    denom: createBaseDenom(),
    nfts: [],
  }
}

export const Collection = {
  decode(input: _m0.Reader | Uint8Array, length?: number): Collection {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseCollection()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.denom = Denom.decode(reader, reader.uint32())
          break

        case 2:
          message.nfts.push(NFT.decode(reader, reader.uint32()))
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },
}

export function createBaseIDCollection(): IDCollection {
  return {
    denom_id: '',
    token_ids: [],
  }
}

export const IDCollection = {
  decode(input: _m0.Reader | Uint8Array, length?: number): IDCollection {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseIDCollection()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.denom_id = reader.string()
          break

        case 2:
          message.token_ids.push(reader.string())
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },
}

export function createBaseOwner(): Owner {
  return {
    address: '',
    id_collections: [],
  }
}

export const Owner = {
  decode(input: _m0.Reader | Uint8Array, length?: number): Owner {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseOwner()

    while (reader.pos < end) {
      const tag = reader.uint32()

      switch (tag >>> 3) {
        case 1:
          message.address = reader.string()
          break

        case 2:
          message.id_collections.push(
            IDCollection.decode(reader, reader.uint32())
          )
          break

        default:
          reader.skipType(tag & 7)
          break
      }
    }

    return message
  },
}
