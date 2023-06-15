import {
  Text,
  Flex,
  Heading,
  Box,
  Image,
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
  SimpleGrid,
} from '@chakra-ui/react'
import { JSONTree } from 'react-json-tree'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { getChain } from '@/config'
import { selectChainId } from '@/store/chainSlice'
import { selectAddress } from '@/store/accountSlice'
import { getCollection, Denom, NFT } from '@/rpc/uptick/collection'
import { getCollectionsByOwner, IDCollection } from '@/query/uptick/collection'
import { getClassTrace, ClassTrace } from '@/query/ibc/nft_transfer'
import {
  isNativeNFT,
  isURL,
  isJSON,
  getTemplateImage,
  getDenomHash,
} from '@/utils/helpers'
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
  const [classTrace, setClassTrace] = useState<ClassTrace>()
  const [nfts, setNFTs] = useState<NFTExtend[]>([])
  const [uriImage, setUriImage] = useState('')
  const [selectedNFT, setSelectedNFT] = useState<NFTExtend>()
  const [isShowClassTrace, setIsShowClassTrace] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    const chain = getChain(chainId)
    if (chain && id) {
      getCollection(chain.rpc, id as string)
        .then((response) => {
          setDenom(response.collection.denom)
          setNFTs(response.collection.nfts)
          setUriImage(response.collection.denom.uri ?? '')
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

  useEffect(() => {
    const chain = getChain(chainId)
    const hash = getDenomHash(denom?.id ?? '')
    if (chain && hash) {
      getClassTrace(chain.rest, hash)
        .then((response) => {
          setClassTrace(response.class_trace)
        })
        .catch(console.error)
    }
  }, [denom])

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

  const handleTransfer = (denomId: string, nftId: string) => {
    router.push({ pathname: '/transfer' }, { query: { denomId, nftId } })
  }

  const setTemplateImage = () => {
    setUriImage(getTemplateImage())
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
            src={isURL(uriImage) ? uriImage : getTemplateImage()}
            alt={denom?.name}
            borderRadius="lg"
            h={200}
            w={200}
            mb={6}
            onError={setTemplateImage}
            objectFit={'cover'}
          />
          <Heading size="lg" mb={2}>
            {isNativeNFT(denom?.id ?? '')
              ? denom?.name ?? '-'
              : classTrace?.base_class_id ?? '-'}
          </Heading>
          <Tag
            colorScheme="orange"
            textColor={useColorModeValue('orange.800', 'orange.100')}
            mb={4}
          >
            {isNativeNFT(denom?.id ?? '') ? 'Native' : 'IBC'}
          </Tag>
          <Text mb={4}>{denom?.description ?? '-'}</Text>
          <Text textTransform={'uppercase'} fontFamily={'mono'}>
            Creator
          </Text>
          <Text>{denom?.creator ?? '-'}</Text>
          {!isNativeNFT(denom?.id ?? '') && (
            <>
              <Button
                mt={4}
                size={'sm'}
                color={'orange.500'}
                borderColor={'orange.500'}
                variant="outline"
                onClick={() => setIsShowClassTrace(!isShowClassTrace)}
              >
                {isShowClassTrace ? 'Hide' : 'Show'} Class Trace
              </Button>
              {isShowClassTrace && (
                <Text
                  mb={4}
                  maxW={600}
                  fontSize={'sm'}
                  fontWeight={'light'}
                  textAlign={'center'}
                >
                  {classTrace?.path ?? '-'}
                </Text>
              )}
            </>
          )}
          <HStack mt={12} gap={6}>
            <Flex
              h={110}
              w={200}
              borderWidth={1}
              borderColor={'orange.600'}
              alignItems={'center'}
              flexDirection={'column'}
              justifyContent={'center'}
              borderRadius={'md'}
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
                borderRadius={'md'}
              >
                <Heading fontWeight={'medium'} mb={1}>
                  {nfts.filter((item) => item.isOwned === true).length}
                </Heading>
                <Text>owned</Text>
              </Flex>
            )}
          </HStack>
          <Box mt={20}>
            <SimpleGrid columns={[1, 1, 3, 3, 5]} spacing="40px">
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
            </SimpleGrid>
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
                    : getTemplateImage()
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
                {isJSON(selectedNFT?.data ?? '') ? (
                  <JSONTree
                    data={JSON.parse(selectedNFT?.data ?? '{}')}
                  ></JSONTree>
                ) : (
                  <Text fontWeight={'semibold'}>
                    {!!selectedNFT?.data ? selectedNFT?.data : '-'}
                  </Text>
                )}
              </Flex>
            </ModalBody>

            <ModalFooter>
              {address === selectedNFT?.owner && (
                <Button
                  colorScheme="orange"
                  onClick={() => handleTransfer(id as string, selectedNFT?.id)}
                >
                  Transfer
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </main>
    </>
  )
}
