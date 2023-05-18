import {
  Account,
  AminoTypes,
  DeliverTxResponse,
  SignerData,
  SigningStargateClient,
  SigningStargateClientOptions,
  StdFee,
  createDefaultAminoConverters,
  defaultRegistryTypes,
} from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import {
  GeneratedType,
  OfflineSigner,
  Registry,
  EncodeObject,
  isOfflineDirectSigner,
  TxBodyEncodeObject,
  makeAuthInfoBytes,
  makeSignDoc,
} from '@cosmjs/proto-signing'
import {
  encodeSecp256k1Pubkey,
  makeSignDoc as makeSignDocAmino,
} from '@cosmjs/amino'
import { Int53 } from '@cosmjs/math'
import { fromBase64 } from '@cosmjs/encoding'
import { AccountParser, accountFromAny } from './accounts'
import {
  uptickCollectionTypes,
  MsgTransferNFTEncodeObject,
  typeUrlMsgTransferNFT,
} from '@/rpc/uptick/collection/messages'
import {
  ibcNFTTransferTypes,
  IBCMsgTransferNFTEncodeObject,
  typeUrlIBCMsgTransferNFT,
} from '@/rpc/ibc/nft_transfer/messages'
import { connectWebsocketClient } from '.'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import assert from 'assert'
import { encodePubkey, encodeEthSecp256k1Pubkey } from './pubkey'
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing'
import { getChain } from '@/config'

export const customRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  ...defaultRegistryTypes,
  ...uptickCollectionTypes,
  ...ibcNFTTransferTypes,
]

function createDefaultRegistry(): Registry {
  return new Registry(customRegistryTypes)
}

export class CustomSigningStargateClient extends SigningStargateClient {
  private readonly accountParserCustom: AccountParser
  private readonly signerCustom: OfflineSigner
  private readonly aminoTypesCustom: AminoTypes

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

    const {
      accountParser = accountFromAny,
      aminoTypes = new AminoTypes(createDefaultAminoConverters()),
    } = options
    this.accountParserCustom = accountParser
    this.signerCustom = signer
    this.aminoTypesCustom = aminoTypes
  }

  public async getAccount(searchAddress: string): Promise<Account | null> {
    try {
      const account = await this.forceGetQueryClient().auth.account(
        searchAddress
      )
      return account ? this.accountParserCustom(account) : null
    } catch (error: any) {
      if (/rpc error: code = NotFound/i.test(error.toString())) {
        return null
      }
      throw error
    }
  }

  public async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    explicitSignerData?: SignerData
  ): Promise<TxRaw> {
    let signerData: SignerData
    if (explicitSignerData) {
      signerData = explicitSignerData
    } else {
      const { accountNumber, sequence } = await this.getSequence(signerAddress)
      const chainId = await this.getChainId()
      signerData = {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId: chainId,
      }
    }

    return isOfflineDirectSigner(this.signerCustom)
      ? this.signDirectCustom(signerAddress, messages, fee, memo, signerData)
      : this.signAminoCustom(signerAddress, messages, fee, memo, signerData)
  }

  private async signAminoCustom(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData
  ): Promise<TxRaw> {
    assert(!isOfflineDirectSigner(this.signerCustom))
    const accountFromSigner = (await this.signerCustom.getAccounts()).find(
      (account) => account.address === signerAddress
    )
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer')
    }
    const chain = getChain(chainId)
    const isEthSigner = chain ? chain.is_eth_signer : false
    const pubkey = encodePubkey(
      isEthSigner
        ? encodeEthSecp256k1Pubkey(accountFromSigner.pubkey)
        : encodeSecp256k1Pubkey(accountFromSigner.pubkey)
    )

    const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON
    const msgs = messages.map((msg) => this.aminoTypesCustom.toAmino(msg))
    const signDoc = makeSignDocAmino(
      msgs,
      fee,
      chainId,
      memo,
      accountNumber,
      sequence
    )
    const { signature, signed } = await this.signerCustom.signAmino(
      signerAddress,
      signDoc
    )
    const signedTxBody = {
      messages: signed.msgs.map((msg) => this.aminoTypesCustom.fromAmino(msg)),
      memo: signed.memo,
    }
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: signedTxBody,
    }
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject)
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber()
    const signedSequence = Int53.fromString(signed.sequence).toNumber()
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence: signedSequence }],
      signed.fee.amount,
      signedGasLimit,
      signed.fee.granter,
      signed.fee.payer,
      signMode
    )
    return TxRaw.fromPartial({
      bodyBytes: signedTxBodyBytes,
      authInfoBytes: signedAuthInfoBytes,
      signatures: [fromBase64(signature.signature)],
    })
  }

  private async signDirectCustom(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string,
    { accountNumber, sequence, chainId }: SignerData
  ): Promise<TxRaw> {
    assert(isOfflineDirectSigner(this.signerCustom))
    const accountFromSigner = (await this.signerCustom.getAccounts()).find(
      (account) => account.address === signerAddress
    )
    if (!accountFromSigner) {
      throw new Error('Failed to retrieve account from signer')
    }

    const chain = getChain(chainId)
    const isEthSigner = chain ? chain.is_eth_signer : false
    const pubkey = encodePubkey(
      isEthSigner
        ? encodeEthSecp256k1Pubkey(accountFromSigner.pubkey)
        : encodeSecp256k1Pubkey(accountFromSigner.pubkey)
    )
    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: '/cosmos.tx.v1beta1.TxBody',
      value: {
        messages: messages,
        memo: memo,
      },
    }
    const txBodyBytes = this.registry.encode(txBodyEncodeObject)
    const gasLimit = Int53.fromString(fee.gas).toNumber()
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence }],
      fee.amount,
      gasLimit,
      fee.granter,
      fee.payer
    )
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber
    )
    const { signature, signed } = await this.signerCustom.signDirect(
      signerAddress,
      signDoc
    )
    return TxRaw.fromPartial({
      bodyBytes: signed.bodyBytes,
      authInfoBytes: signed.authInfoBytes,
      signatures: [fromBase64(signature.signature)],
    })
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
        name: '[do-not-modify]',
        uri: '[do-not-modify]',
        uriHash: '[do-not-modify]',
        data: '[do-not-modify]',
      },
    }
    return this.signAndBroadcast(sender, [transferNFTMsg], fee, memo)
  }

  public async nftTransferIBC(
    id: string,
    denomId: string,
    sender: string,
    receiver: string,
    sourceChannel: string,
    timeoutTimestamp: number,
    fee: StdFee | 'auto' | number,
    memo = ''
  ): Promise<DeliverTxResponse> {
    const ibcTransferNFTMsg: IBCMsgTransferNFTEncodeObject = {
      typeUrl: typeUrlIBCMsgTransferNFT,
      value: {
        sourcePort: 'nft-transfer',
        sourceChannel: sourceChannel,
        classId: denomId,
        tokenIds: [id],
        sender: sender,
        receiver: receiver,
        timeoutTimestamp: timeoutTimestamp,
      },
    }
    return this.signAndBroadcast(sender, [ibcTransferNFTMsg], fee, memo)
  }
}
