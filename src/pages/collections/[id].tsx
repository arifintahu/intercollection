import { Text, Flex, Heading, Box, Grid } from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { getCollection, Denom, NFT } from '@/query/uptick/collection'

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
        ></Flex>
      </main>
    </>
  )
}
