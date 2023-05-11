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
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { selectAddress } from '@/store/accountSlice'
import { getCollection, Denom, NFT } from '@/rpc/uptick/collection'
import { getCollectionsByOwner, IDCollection } from '@/query/uptick/collection'
import { isNativeNFT, isURL, templateImage } from '@/utils/helpers'
import CardNFT from '@/components/CardNFT'

interface NFTExtend extends NFT {
  isOwned?: boolean
}
export default function CollectionsDetail() {
  const router = useRouter()
  const { id } = router.query
  const chainId = useSelector(selectChainId)
  const address = useSelector(selectAddress)
  const [denom, setDenom] = useState<Denom>()
  const [nfts, setNFTs] = useState<NFTExtend[]>([])
  const [selectedNFT, setSelectedNFT] = useState<NFTExtend>()
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && id) {
      getCollection(chain.rpc, id as string)
        .then((response) => {
          setDenom(response.collection.denom)
          setNFTs(response.collection.nfts)
        })
        .catch(console.error)
    }
  }, [chainId, id])

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && id && address && denom) {
      getCollectionsByOwner(chain.rest, address, id as string)
        .then((response) => {
          if (response.owner.id_collections.length) {
            updateNFTsOwner(response.owner.id_collections[0])
          }
        })
        .catch(console.error)
    }
  }, [chainId, id, address, denom])

  const updateNFTsOwner = (idCollection: IDCollection) => {
    if (idCollection.denom_id == denom?.id) {
      const updated = nfts.map((item) => {
        const isOwned = idCollection.token_ids.some((val) => val == item.id)
        return {
          ...item,
          isOwned,
        }
      })
      setNFTs(updated)
    }
  }

  const openCardNFT = (id: string) => {
    const nft = nfts.find((item) => item.id === id)
    setSelectedNFT(nft)
    onOpen()
  }

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
          <HStack gap={6}>
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
            {!!address && (
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
                  {nfts.filter((item) => item.isOwned === true).length}
                </Heading>
                <Text>owned</Text>
              </Flex>
            )}
          </HStack>
          <Box mt={20}>
            <Grid templateColumns="repeat(5, 1fr)" gap={10}>
              {nfts.map((item) => (
                <CardNFT
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  uri={item.uri ?? ''}
                  isOwned={item.isOwned}
                  onClick={() => openCardNFT(item.id)}
                />
              ))}
            </Grid>
          </Box>
        </Flex>

        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>NFT Detail</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src={
                  isURL(selectedNFT?.uri ?? '')
                    ? selectedNFT?.uri
                    : templateImage
                }
                alt={selectedNFT?.id}
                borderRadius="lg"
                h={300}
                w={'auto'}
                mx={'auto'}
                mb={4}
              />
              <Flex flexDirection={'column'} gap={0} mb={4}>
                <Text fontSize={'sm'}>NFT ID</Text>
                <Text fontWeight={'semibold'}>{selectedNFT?.id}</Text>
              </Flex>
              <Flex flexDirection={'column'} gap={0} mb={4}>
                <Text fontSize={'sm'}>Name</Text>
                <Text fontWeight={'semibold'}>
                  {!!selectedNFT?.name ? selectedNFT?.name : '-'}
                </Text>
              </Flex>
              <Flex flexDirection={'column'} gap={0} mb={4}>
                <Text fontSize={'sm'}>Owner</Text>
                <Text fontWeight={'semibold'}>{selectedNFT?.owner}</Text>
              </Flex>
              <Flex flexDirection={'column'} gap={0} mb={4}>
                <Text fontSize={'sm'}>URI</Text>
                <Text fontWeight={'semibold'}>
                  {!!selectedNFT?.uri ? selectedNFT?.uri : '-'}
                </Text>
              </Flex>
              <Flex flexDirection={'column'} gap={0} mb={4}>
                <Text fontSize={'sm'}>Data</Text>
                <Text fontWeight={'semibold'}>
                  {!!selectedNFT?.data ? selectedNFT?.data : '-'}
                </Text>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="orange">Transfer</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>
    </>
  )
}
