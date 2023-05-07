import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
  useColorMode,
  Heading,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
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
