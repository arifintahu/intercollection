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
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NextLink from 'next/link'
import { getChains, Chain, getChain } from '@/config'
import { setChainId, selectChainId } from '@/store/chainSlice'
import { setAddress, selectAddress } from '@/store/accountSlice'
import { trimAddress, showBalance } from '@/utils/helpers'
import { getBalances, Balance } from '@/query/cosmos/bank'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [chains, setChains] = useState<Chain[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
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
    if (chain && address) {
      getBalances(chain.rest, address).then((response) => {
        setBalances(response.balances)
      })
    }
  }, [chainId, address])

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

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={24}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Link
            as={NextLink}
            href={'/'}
            style={{ textDecoration: 'none' }}
            _focus={{ boxShadow: 'none' }}
          >
            <Heading
              size={'sm'}
              fontFamily={'mono'}
              textTransform={'uppercase'}
              letterSpacing={3}
            >
              Inter Collection
            </Heading>
          </Link>

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
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

              {!!address ? (
                <Flex
                  flexDirection={'column'}
                  justifyContent={'center'}
                  alignItems={'flex-end'}
                >
                  <Text fontSize={'sm'}>{trimAddress(address)}</Text>
                  <Text fontSize={'sm'}>
                    {balances.length
                      ? showBalance(balances[0].denom, balances[0].amount)
                      : ''}
                  </Text>
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
                  Connect
                </Button>
              )}
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
              colorScheme="orange"
              variant="outline"
              width={'full'}
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
