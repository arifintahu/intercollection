import { Text, Flex, Heading, Box, Grid, useToast } from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CardCollection from '@/components/CardCollection'
import { getCollectionsByOwner, IDCollection } from '@/query/uptick/collection'
import { getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { trimDenom } from '@/utils/helpers'
import { selectAddress } from '@/store/accountSlice'

export default function MyCollections() {
  const chainId = useSelector(selectChainId)
  const [idCollections, setIdCollections] = useState<IDCollection[]>([])
  const address = useSelector(selectAddress)

  const toast = useToast()

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && address) {
      getCollectionsByOwner(chain.rest, address)
        .then((response) => {
          setIdCollections(response.owner.id_collections)
        })
        .catch(console.error)
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

  return (
    <>
      <Head>
        <title>My Collections | Inter Collection</title>
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
            My Collections
          </Heading>
          <Text fontWeight={'light'} fontSize={'lg'}>
            Uptick on-chain collections
          </Text>
          <Box mt={8}>
            <Grid templateColumns="repeat(5, 1fr)" gap={10}>
              {idCollections.map((item) => (
                <CardCollection
                  key={item.denom_id}
                  id={item.denom_id}
                  name={trimDenom(item.denom_id)}
                  description={`${item.token_ids.length} NFTs owned`}
                  uri={''}
                />
              ))}
            </Grid>
          </Box>
        </Flex>
      </main>
    </>
  )
}
