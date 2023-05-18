import Long from 'long'
import _m0 from 'protobufjs/minimal'

/**
 * Height is a monotonically increasing data type
 * that can be compared against another Height for the purposes of updating and
 * freezing clients
 *
 * Normally the RevisionHeight is incremented at each height while keeping
 * RevisionNumber the same. However some consensus algorithms may choose to
 * reset the height in certain conditions e.g. hard forks, state-machine
 * breaking changes In these cases, the RevisionNumber is incremented so that
 * height continues to be monitonically increasing even as the RevisionHeight
 * gets reset
 */
export interface Height {
  /** the revision that the client is currently on */
  revisionNumber: number
  /** the height within the given revision */
  revisionHeight: number
}

function createBaseHeight(): Height {
  return { revisionNumber: 0, revisionHeight: 0 }
}

export const Height = {
  encode(
    message: Height,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.revisionNumber !== 0) {
      writer.uint32(8).uint64(message.revisionNumber)
    }
    if (message.revisionHeight !== 0) {
      writer.uint32(16).uint64(message.revisionHeight)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Height {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseHeight()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.revisionNumber = longToNumber(reader.uint64() as Long)
          break
        case 2:
          message.revisionHeight = longToNumber(reader.uint64() as Long)
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): Height {
    return {
      revisionNumber: isSet(object.revisionNumber)
        ? Number(object.revisionNumber)
        : 0,
      revisionHeight: isSet(object.revisionHeight)
        ? Number(object.revisionHeight)
        : 0,
    }
  },

  toJSON(message: Height): unknown {
    const obj: any = {}
    message.revisionNumber !== undefined &&
      (obj.revisionNumber = Math.round(message.revisionNumber))
    message.revisionHeight !== undefined &&
      (obj.revisionHeight = Math.round(message.revisionHeight))
    return obj
  },

  fromPartial<I extends Exact<DeepPartial<Height>, I>>(object: I): Height {
    const message = createBaseHeight()
    message.revisionNumber = object.revisionNumber ?? 0
    message.revisionHeight = object.revisionHeight ?? 0
    return message
  },
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

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error('Value is larger than Number.MAX_SAFE_INTEGER')
  }
  return long.toNumber()
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any
  _m0.configure()
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
