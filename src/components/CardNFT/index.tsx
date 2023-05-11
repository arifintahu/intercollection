import {
  Text,
  Heading,
  Card,
  CardBody,
  Stack,
  Image,
  Box,
  Tag,
  useColorModeValue,
} from '@chakra-ui/react'
import { isURL, templateImage } from '@/utils/helpers'
import { MouseEventHandler } from 'react'

type CardNFTProps = {
  id: string
  name: string
  uri: string
  isOwned?: boolean
  onClick: MouseEventHandler
}

export default function CardNFT({
  id,
  name,
  uri,
  isOwned,
  onClick,
}: CardNFTProps) {
  return (
    <Card maxW="sm" shadow={'none'}>
      <CardBody>
        <Box position={'relative'}>
          <Image
            src={isURL(uri) ? uri : templateImage}
            alt={id}
            borderRadius="lg"
            h={200}
            w={200}
            transition={'all 0.5s ease-in-out'}
            _hover={{
              transform: 'scale(1.1,1.1)',
            }}
            cursor={'pointer'}
            onClick={onClick}
          />
          {isOwned === true && (
            <Tag
              position={'absolute'}
              top={1}
              left={1}
              colorScheme="green"
              backgroundColor={useColorModeValue('green.100', 'green.700')}
              textColor={useColorModeValue('green.800', 'gray.100')}
            >
              Owned
            </Tag>
          )}
        </Box>

        <Stack mt="6" spacing="2">
          <Heading size="base">{!!name ? name : '-'}</Heading>
          <Text fontSize="sm">{id}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
