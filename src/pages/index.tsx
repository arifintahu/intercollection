import { Text, Flex, Heading, Box, Grid } from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import CardCollection from '@/components/CardCollection'
import { getDenoms } from '@/query/uptick/collection'
import { getChains } from '@/config'

export default function Home() {
  useEffect(() => {
    const chain = getChains()[0]
    getDenoms(chain.rest).then(console.log).catch(console.warn)
  }, [])

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
              <CardCollection />
              <CardCollection />
              <CardCollection />
              <CardCollection />
              <CardCollection />
              <CardCollection />
            </Grid>
          </Box>
        </Flex>
      </main>
    </>
  )
}
