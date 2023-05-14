import {
  DeliverTxResponse,
  SigningStargateClient,
  SigningStargateClientOptions,
  StdFee,
  defaultRegistryTypes,
} from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { GeneratedType, OfflineSigner, Registry } from '@cosmjs/proto-signing'
import {
  uptickCollectionTypes,
  MsgTransferNFTEncodeObject,
  typeUrlMsgTransferNFT,
} from '@/rpc/uptick/collection/messages'
import { connectWebsocketClient } from '.'

export const customRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...defaultRegistryTypes,
  ...uptickCollectionTypes,
]

function createDefaultRegistry(): Registry {
  return new Registry(customRegistryTypes)
}

export class CustomSigningStargateClient extends SigningStargateClient {
  public static async connectWithSigner(
    endpoint: string,
    signer: OfflineSigner,
    options: SigningStargateClientOptions = {}
  ): Promise<CustomSigningStargateClient> {
    const tmClient = await connectWebsocketClient(endpoint)
    return new CustomSigningStargateClient(tmClient, signer, {
      registry: createDefaultRegistry(),
      ...options,
    })
  }

  protected constructor(
    tmClient: Tendermint34Client | undefined,
    signer: OfflineSigner,
    options: SigningStargateClientOptions
  ) {
    super(tmClient, signer, options)
  }

  public async nftTransfer(
    id: string,
    denomId: string,
    sender: string,
    recipient: string,
    fee: StdFee | 'auto' | number,
    memo = ''
  ): Promise<DeliverTxResponse> {
    const transferNFTMsg: MsgTransferNFTEncodeObject = {
      typeUrl: typeUrlMsgTransferNFT,
      value: {
        id: id,
        denomId: denomId,
        sender: sender,
        recipient: recipient,
      },
    }
    return this.signAndBroadcast(sender, [transferNFTMsg], fee, memo)
  }
}
