import {
  Text,
  Flex,
  Heading,
  Box,
  Card,
  CardBody,
  Stack,
  StackDivider,
  Select,
  useColorModeValue,
  Button,
  Input,
  useToast,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import {
  DeliverTxResponse,
  GasPrice,
  assertIsDeliverTxSuccess,
} from '@cosmjs/stargate'
import { getCollectionsByOwner, IDCollection } from '@/query/uptick/collection'
import {
  getChain,
  getDestinationChains,
  DestinationChain,
  getChannel,
} from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { selectAddress } from '@/store/accountSlice'
import {
  trimDenom,
  trimTokenId,
  extractQueryPath,
  getTimeoutTimestamp,
} from '@/utils/helpers'
import { CustomSigningStargateClient } from '@/rpc/client'

export default function Transfer() {
  const router = useRouter()
  const [idCollections, setIdCollections] = useState<IDCollection[]>([])
  const [destChains, setDestChains] = useState<DestinationChain[]>([])
  const [tokenIds, setTokenIds] = useState<string[]>([])
  const [destChainId, setDestChainId] = useState('')
  const [selectedDenom, setSelectedDenom] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [isIBC, setIsIBC] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const chainId = useSelector(selectChainId)
  const address = useSelector(selectAddress)

  const toast = useToast()

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && address) {
      getCollectionsByOwner(chain.rest, address)
        .then((response) => {
          setIdCollections(response.owner.id_collections)
          if (response.owner.id_collections.length) {
            const { denomId, nftId } = extractQueryPath(router.asPath)
            if (denomId) {
              setSelectedDenom(denomId)
            } else {
              setSelectedDenom(response.owner.id_collections[0].denom_id)
            }

            if (nftId) {
              const idCollection = idCollections.find(
                (item) => item.denom_id === denomId
              )
              if (idCollection) {
                setTokenIds(idCollection.token_ids)
                if (idCollection.token_ids.some((item) => item === nftId)) {
                  setSelectedToken(nftId)
                }
              }
            }
          }
        })
        .catch(console.error)

      setDestChains(getDestinationChains())
    } else {
      toast({
        title: 'Please connect to keplr wallet!',
        status: 'warning',
        duration: 9000,
        position: 'top',
        variant: 'left-accent',
        isClosable: true,
      })
    }
  }, [chainId, address])

  useEffect(() => {
    if (!!chainId && !!destChainId) {
      setIsIBC(chainId !== destChainId)
    }
  }, [chainId, destChainId])

  useEffect(() => {
    if (selectedDenom && idCollections.length) {
      const idCollection = idCollections.find(
        (item) => item.denom_id === selectedDenom
      )
      if (idCollection) {
        setTokenIds(idCollection.token_ids)
        if (idCollection.token_ids.length && !selectedToken) {
          setSelectedToken(idCollection.token_ids[0])
        }
      }
    }
  }, [selectedDenom, idCollections])

  const handleSelectDestChain = (event: any) => {
    setDestChainId(event.target.value as string)
  }

  const handleSelectDenom = (event: any) => {
    const denom = event.target.value as string
    setSelectedDenom(denom)
  }

  const handleSelectToken = (event: any) => {
    setSelectedToken(event.target.value as string)
  }

  const handleRecipientAddress = (event: any) => {
    setRecipientAddress(event.target.value as string)
  }

  const handleTransfer = async () => {
    if (window.keplr) {
      await window.keplr.enable(chainId)
      const offlineSigner = window.keplr.getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()

      const chain = getChain(chainId)

      if (chain) {
        const client: CustomSigningStargateClient =
          await CustomSigningStargateClient.connectWithSigner(
            chain?.rpc,
            offlineSigner,
            {
              gasPrice: GasPrice.fromString(chain.gas_price),
            }
          )

        if (isIBC && !!destChainId) {
          const channel = getChannel(chainId, destChainId)
          if (channel) {
            setIsLoading(true)
            const timeoutTimestamp = getTimeoutTimestamp()
            const resp = await client
              .nftTransferIBC(
                selectedToken,
                selectedDenom,
                accounts[0].address,
                recipientAddress,
                channel.src_channel,
                timeoutTimestamp,
                'auto'
              )
              .catch((err: Error) => {
                showError('Error Transfer NFT', err.message)
              })

            if (resp) {
              showResponse(resp)
            }
          } else {
            toast({
              title: 'IBC channel not found',
              description: `Channel between ${chainId} and ${destChainId} is not found`,
              status: 'warning',
              isClosable: true,
            })
          }
        } else {
          setIsLoading(true)
          const resp = await client
            .nftTransfer(
              selectedToken,
              selectedDenom,
              accounts[0].address,
              recipientAddress,
              'auto'
            )
            .catch((err: Error) => {
              showError('Error Transfer NFT', err.message)
            })

          if (resp) {
            showResponse(resp)
          }
        }
      }
    } else {
      toast({
        title: 'Please install keplr extension',
        status: 'warning',
        isClosable: true,
      })
    }
  }

  const showError = (title: string, message: string) => {
    setIsLoading(false)
    toast({
      title: title,
      description: message,
      status: 'error',
      isClosable: true,
    })
  }

  const showResponse = (resp: DeliverTxResponse) => {
    assertIsDeliverTxSuccess(resp)
    setIsLoading(false)
    if (resp.code === 0) {
      toast({
        title: 'Tx Success',
        description: `TxHash: ${resp.transactionHash}`,
        status: 'success',
        duration: 15000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Tx Failed',
        description: `Error code: ${resp.code}, TxHash: ${resp.transactionHash}`,
        status: 'error',
        duration: 15000,
        isClosable: true,
      })
    }
  }

  return (
    <>
      <Head>
        <title>Transfer | Inter Collection</title>
        <meta name="description" content="My Collections | Inter Collection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          alignItems={'center'}
          flexDirection={'column'}
          justifyContent={'center'}
        >
          <Heading fontWeight={'medium'} size={'xl'}>
            Transfer
          </Heading>
          <Text fontWeight={'light'} fontSize={'lg'} mb={6}>
            NFT Transfer and Interchain NFT Transfer
          </Text>
          <Card
            minW={'sm'}
            shadow={'none'}
            borderWidth={0.5}
            borderColor={useColorModeValue('orange.400', 'orange.800')}
          >
            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Destination Chain
                  </Heading>
                  <Select
                    pt={2}
                    defaultValue={
                      destChains.length ? destChains[0].chain_id : ''
                    }
                    onChange={handleSelectDestChain}
                  >
                    {destChains.map((item) => (
                      <option key={item.chain_id} value={item.chain_id}>
                        {item.description}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Denom
                  </Heading>
                  <Select
                    pt={2}
                    value={selectedDenom}
                    onChange={handleSelectDenom}
                  >
                    {idCollections.map((item) => (
                      <option key={item.denom_id} value={item.denom_id}>
                        {trimDenom(item.denom_id)}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    NFT
                  </Heading>
                  <Select
                    pt={2}
                    value={selectedToken}
                    onChange={handleSelectToken}
                  >
                    {tokenIds.map((val) => (
                      <option key={val} value={val}>
                        {trimTokenId(val)}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Box>
                  <Heading size="xs" textTransform="uppercase">
                    Recipient Address
                  </Heading>
                  <Input
                    mt={2}
                    placeholder="Address"
                    onChange={handleRecipientAddress}
                  ></Input>
                </Box>
                <Button
                  colorScheme="orange"
                  onClick={handleTransfer}
                  isLoading={isLoading}
                  loadingText="Processing"
                >
                  {isIBC ? 'IBC Transfer' : 'Transfer'}
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Flex>
      </main>
    </>
  )
}
