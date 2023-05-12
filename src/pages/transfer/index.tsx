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
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getCollectionsByOwner, IDCollection } from '@/query/uptick/collection'
import { getChain, getDestinationChains, DestinationChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { selectAddress } from '@/store/accountSlice'
import { trimDenom, trimTokenId } from '@/utils/helpers'

export default function Transfer() {
  const [idCollections, setIdCollections] = useState<IDCollection[]>([])
  const [destChains, setDestChains] = useState<DestinationChain[]>([])
  const [tokenIds, setTokenIds] = useState<string[]>([])
  const [destChainId, setDestChainId] = useState('')
  const [selectedDenom, setSelectedDenom] = useState('')
  const [selectedToken, setSelectedToken] = useState('')
  const [isIBC, setIsIBC] = useState(false)

  const chainId = useSelector(selectChainId)
  const address = useSelector(selectAddress)

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && address) {
      getCollectionsByOwner(chain.rest, address)
        .then((response) => {
          setIdCollections(response.owner.id_collections)
        })
        .catch(console.error)

      setDestChains(getDestinationChains())
    }
  }, [chainId, address])

  useEffect(() => {
    if (!!chainId && !!destChainId) {
      setIsIBC(chainId !== destChainId)
    }
  }, [chainId, destChainId])

  const handleSelectDestChain = (event: any) => {
    setDestChainId(event.target.value as string)
  }

  const handleSelectDenom = (event: any) => {
    const denom = event.target.value as string
    setSelectedDenom(denom)
    const idCollection = idCollections.find((item) => item.denom_id === denom)
    if (idCollection) {
      setTokenIds(idCollection.token_ids)
    }
  }

  const handleSelectToken = (event: any) => {
    setSelectedToken(event.target.value as string)
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
                  <Select pt={2} onChange={handleSelectDenom}>
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
                  <Select pt={2} onChange={handleSelectToken}>
                    {tokenIds.map((val) => (
                      <option key={val} value={val}>
                        {trimTokenId(val)}
                      </option>
                    ))}
                  </Select>
                </Box>
                <Button colorScheme="orange">
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
