import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Heading,
  Select,
  Link,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  HStack,
  Image,
  Tooltip,
  IconButton,
} from '@chakra-ui/react'
import { CheckIcon, CopyIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NextLink from 'next/link'
import { FiLogOut } from 'react-icons/fi'

import { getChains, Chain, getChain } from '@/config'
import { setChainId, selectChainId } from '@/store/chainSlice'
import { setAddress, selectAddress } from '@/store/accountSlice'
import { trimAddress, showBalance } from '@/utils/helpers'
import { getBalances, Balance } from '@/query/cosmos/bank'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [chains, setChains] = useState<Chain[]>([])
  const [chain, setChain] = useState<Chain | null>()
  const [balances, setBalances] = useState<Balance[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const chainId = useSelector(selectChainId)
  const address = useSelector(selectAddress)
  const finalRef = useRef(null)

  useEffect(() => {
    if (chains.length) {
      dispatch(setChainId(chains[0].chain_id))
    } else {
      setChains(getChains())
    }
  }, [chains])

  useEffect(() => {
    const chain = getChain(chainId)
    setChain(chain)
    if (chain && address) {
      getBalances(chain.rest, address).then((response) => {
        setBalances(response.balances)
      })
    }
  }, [chainId, address])

  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    }
  }, [isCopied])

  const handleSelectChain = (event: any) => {
    dispatch(setChainId(event.target.value as string))
  }

  const handleKeplr = async () => {
    if (window.keplr) {
      await window.keplr.enable(chainId)
      const offlineSigner = window.keplr.getOfflineSigner(chainId)
      const accounts = await offlineSigner.getAccounts()
      if (accounts[0].address) {
        dispatch(setAddress(accounts[0].address))
        onClose()
      }
    } else {
      alert('Please install keplr extension')
    }
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
    setIsCopied(true)
  }

  return (
    <>
      <Box
        bg={useColorModeValue('gray.100', 'gray.900')}
        px={24}
        position={'fixed'}
        top={0}
        zIndex={99}
        w={'full'}
      >
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems={'center'} gap={6}>
            <Link
              as={NextLink}
              href={'/'}
              style={{ textDecoration: 'none' }}
              _focus={{ boxShadow: 'none' }}
            >
              <Image
                alt="Logo"
                src={
                  colorMode === 'light'
                    ? '/images/logo-dark.svg'
                    : '/images/logo-light.svg'
                }
                w={130}
                h={'auto'}
              ></Image>
            </Link>
            <HStack>
              <Link
                as={NextLink}
                href={'/'}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Button>Home</Button>
              </Link>
              <Link
                as={NextLink}
                href={'/mycollections'}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Button>My Collections</Button>
              </Link>
              <Link
                as={NextLink}
                href={'/transfer'}
                style={{ textDecoration: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Button>Transfer</Button>
              </Link>
            </HStack>
          </Flex>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} alignItems={'center'} spacing={7}>
              <Select
                variant={'outline'}
                defaultValue={chains.length ? chains[0].chain_id : ''}
                borderColor={useColorModeValue('gray.500', 'gray.300')}
                width={180}
                onChange={handleSelectChain}
              >
                {chains.map((item) => (
                  <option key={item.chain_id} value={item.chain_id}>
                    {item.description}
                  </option>
                ))}
              </Select>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Flex alignItems={'center'}>
                <Stack direction={'row'} spacing={7}>
                  {!!address ? (
                    <Flex
                      borderColor={
                        colorMode === 'light' ? 'gray.800' : 'whiteAlpha.300'
                      }
                      borderWidth={1}
                      py={1}
                      px={3}
                      borderRadius={'md'}
                      minW={220}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                    >
                      <Flex
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'flex-start'}
                      >
                        <Text fontSize={'sm'}>{trimAddress(address)}</Text>
                        <Text fontSize={'sm'}>
                          {chain ? showBalance(balances, chain.coin) : ''}
                        </Text>
                      </Flex>
                      <Flex gap={1}>
                        <Tooltip label={isCopied ? 'Copied' : 'Copy Address'}>
                          <IconButton
                            size={'sm'}
                            variant={'ghost'}
                            aria-label="Copy Address"
                            icon={isCopied ? <CheckIcon /> : <CopyIcon />}
                            onClick={copyAddress}
                          />
                        </Tooltip>
                        <Tooltip label="Disconnect">
                          <IconButton
                            size={'sm'}
                            variant={'ghost'}
                            aria-label="Disconnect"
                            icon={<FiLogOut />}
                            onClick={() => dispatch(setAddress(''))}
                          />
                        </Tooltip>
                      </Flex>
                    </Flex>
                  ) : (
                    <Button
                      as={'a'}
                      display={{ base: 'none', md: 'inline-flex' }}
                      fontSize={'md'}
                      px={8}
                      color={'white'}
                      bg={'orange.500'}
                      href={'#'}
                      _hover={{
                        bg: 'orange.400',
                      }}
                      minW={150}
                      onClick={onOpen}
                    >
                      Connect Wallet
                    </Button>
                  )}
                </Stack>
              </Flex>
            </Stack>
          </Flex>
        </Flex>
      </Box>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect an Interchain Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody px={6} py={8}>
            <Button
              bg={'orange.500'}
              _hover={{
                bg: 'orange.400',
              }}
              width={'full'}
              color={'white'}
              onClick={handleKeplr}
            >
              Keplr Wallet
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
