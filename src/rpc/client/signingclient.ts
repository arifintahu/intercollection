import {
  DeliverTxResponse,
  GasPrice,
  SigningStargateClient,
  SigningStargateClientOptions,
  StdFee,
  calculateFee,
  defaultRegistryTypes,
} from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import {
  GeneratedType,
  OfflineSigner,
  Registry,
  EncodeObject,
} from '@cosmjs/proto-signing'
import { assertDefined } from '@cosmjs/utils'
import {
  uptickCollectionTypes,
  MsgTransferNFTEncodeObject,
  typeUrlMsgTransferNFT,
} from '@/rpc/uptick/collection/messages'
import { connectWebsocketClient } from '.'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'

export const customRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...defaultRegistryTypes,
  ...uptickCollectionTypes,
]

function createDefaultRegistry(): Registry {
  return new Registry(customRegistryTypes)
}

export class CustomSigningStargateClient extends SigningStargateClient {
  private readonly customGasPrice: GasPrice | undefined

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

    this.customGasPrice = options.gasPrice
  }

  public async signAndBroadcastEth(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | 'auto' | number,
    memo = ''
  ): Promise<DeliverTxResponse> {
    let usedFee: StdFee
    if (fee == 'auto' || typeof fee === 'number') {
      assertDefined(
        this.customGasPrice,
        'Gas price must be set in the client options when auto gas is used.'
      )
      const gasEstimation = await this.simulate(signerAddress, messages, memo)
      const multiplier = typeof fee === 'number' ? fee : 1.3
      usedFee = calculateFee(
        Math.round(gasEstimation * multiplier),
        this.customGasPrice
      )
    } else {
      usedFee = fee
    }
    const txRaw = await this.sign(signerAddress, messages, usedFee, memo)
    const txBytes = TxRaw.encode(txRaw).finish()
    return this.broadcastTx(
      txBytes,
      this.broadcastTimeoutMs,
      this.broadcastPollIntervalMs
    )
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
