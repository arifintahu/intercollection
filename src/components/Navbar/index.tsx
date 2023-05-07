import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Heading,
  Select,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getChains, Chain } from '@/config'
import { setChainId } from '@/store/chainSlice'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [chains, setChains] = useState<Chain[]>([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (chains.length) {
      dispatch(setChainId(chains[0].chain_id))
    } else {
      setChains(getChains())
    }
  }, [chains])

  const handleSelectChain = (event: any) => {
    dispatch(setChainId(event.target.value as string))
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={24}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Heading
            size={'sm'}
            fontFamily={'mono'}
            textTransform={'uppercase'}
            letterSpacing={3}
          >
            Inter Collection
          </Heading>

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
              >
                Connect
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  )
}
