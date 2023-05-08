import { Text, Flex, Heading, Box, Grid } from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CardCollection from '@/components/CardCollection'
import { getDenoms, Denom } from '@/query/uptick/collection'
import { getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'

export default function Home() {
  const chainId = useSelector(selectChainId)
  const [denoms, setDenoms] = useState<Denom[]>([])

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain) {
      getDenoms(chain.rest).then((response) => {
        console.log(response)
        setDenoms(response.denoms)
      })
    }
  }, [chainId])

  return (
    <>
      <Head>
        <title>Home | Inter Collection</title>
        <meta name="description" content="Home | Inter Collection" />
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
            NFT Collections
          </Heading>
          <Text fontWeight={'light'} fontSize={'lg'}>
            Uptick on-chain collections
          </Text>
          <Box mt={8}>
            <Grid templateColumns="repeat(5, 1fr)" gap={10}>
              {denoms.map((item) => (
                <CardCollection
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
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
