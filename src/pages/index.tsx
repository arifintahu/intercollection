import { Text, Flex, Heading, Box, Grid, Skeleton } from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import CardCollection from '@/components/CardCollection'
import { getDenoms, Denom } from '@/query/uptick/collection'
import { Chain, getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { trimDenom } from '@/utils/helpers'

const sampleDenom: Denom = {
  id: '',
  name: '',
  symbol: '',
  uri: '',
}

export default function Home() {
  const chainId = useSelector(selectChainId)
  const [denoms, setDenoms] = useState<Denom[]>([])

  const chain = useRef<Chain | null>()
  const prevKey = useRef('')
  const nextKey = useRef('')
  const isLoading = useRef(true)

  useEffect(() => {
    const chain1 = getChain(chainId)
    if (chain1) {
      chain.current = chain1
      handleGetDenoms(chain1)
    }
  }, [chainId])

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  const handleGetDenoms = async (chain: Chain) => {
    isLoading.current = true
    prevKey.current = nextKey.current
    const limit = 20
    const response = await getDenoms(chain.rest, nextKey.current, limit)
    if (response) {
      nextKey.current = response.pagination.next_key
      setDenoms((prevVals) => [...prevVals, ...response.denoms])
    }
    setTimeout(() => {
      isLoading.current = false
    }, 1000)
  }

  const handleScrollEnd = () => {
    if (
      prevKey.current !== nextKey.current &&
      !isLoading.current &&
      chain.current
    ) {
      handleGetDenoms(chain.current)
    }
  }

  const handleScroll = (e: any) => {
    const clientHeight = e.target.scrollingElement.clientHeight as number
    const scrollHeight = e.target.scrollingElement.scrollHeight as number
    const scrollTop = e.target.scrollingElement.scrollTop as number
    const treshold = 100
    const scrollY = scrollTop + clientHeight

    if (scrollY >= scrollHeight - treshold && scrollY <= scrollHeight) {
      handleScrollEnd()
    }
  }

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
                  name={trimDenom(item.id)}
                  description={item.name}
                  uri={item.uri}
                />
              ))}
            </Grid>
            {isLoading && (
              <Grid templateColumns="repeat(5, 1fr)" gap={10}>
                {new Array(5).fill(1).map((_, index) => (
                  <Skeleton key={Math.random() + index}>
                    <CardCollection
                      id={sampleDenom.id}
                      name={sampleDenom.name}
                      description={sampleDenom.name}
                      uri={sampleDenom.uri}
                    />
                  </Skeleton>
                ))}
              </Grid>
            )}
          </Box>
        </Flex>
      </main>
    </>
  )
}
