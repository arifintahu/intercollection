import {
  Text,
  Flex,
  Heading,
  Box,
  Grid,
  Image,
  Stack,
  Tag,
  useColorModeValue,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { getCollection, Denom, NFT } from '@/query/uptick/collection'
import { isNativeNFT, isURL } from '@/utils/helpers'
import CardNFT from '@/components/CardNFT'

const templateImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'

export default function CollectionsDetail() {
  const router = useRouter()
  const { id } = router.query
  const chainId = useSelector(selectChainId)
  const [denom, setDenom] = useState<Denom>()
  const [nfts, setNFTs] = useState<NFT[]>([])

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && id) {
      getCollection(chain.rest, id as string).then((response) => {
        console.log(response)
        setDenom(response.collection.denom)
        setNFTs(response.collection.nfts)
      })
    }
  }, [chainId, id])

  return (
    <>
      <Head>
        <title>Collection Detail | Inter Collection</title>
        <meta name="description" content="Home | Inter Collection" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          alignItems={'center'}
          flexDirection={'column'}
          justifyContent={'center'}
          mb={12}
        >
          <Image
            src={isURL(denom?.uri ?? '') ? denom?.uri : templateImage}
            alt={denom?.name}
            borderRadius="lg"
            h={200}
            w={200}
            mb={6}
          />
          <Heading size="lg" mb={2}>
            {denom?.name ?? '-'}
          </Heading>
          <Tag
            colorScheme="orange"
            textColor={useColorModeValue('orange.800', 'orange.100')}
            mb={4}
          >
            {isNativeNFT(denom?.id ?? '') ? 'Native' : 'IBC'}
          </Tag>
          <Text mb={4}>{denom?.description ?? '-'}</Text>
          <Text size={'sm'} textTransform={'uppercase'} fontFamily={'mono'}>
            Creator
          </Text>
          <Text mb={12}>{denom?.creator ?? '-'}</Text>
          <Flex
            h={110}
            w={200}
            borderWidth={1}
            borderColor={'orange.600'}
            alignItems={'center'}
            flexDirection={'column'}
            justifyContent={'center'}
          >
            <Heading fontWeight={'medium'} mb={1}>
              {nfts.length}
            </Heading>
            <Text>items</Text>
          </Flex>
          <Box mt={20}>
            <Grid templateColumns="repeat(5, 1fr)" gap={10}>
              {nfts.map((item) => (
                <CardNFT
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  uri={item.uri}
                />
              ))}
            </Grid>
          </Box>
        </Flex>
      </main>
    </>
  )
}
