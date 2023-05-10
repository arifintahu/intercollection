import {
  Text,
  Heading,
  Card,
  CardBody,
  Stack,
  Image,
  Link,
} from '@chakra-ui/react'
import { isURL } from '@/utils/helpers'
import NextLink from 'next/link'

type CardNFTProps = {
  id: string
  name: string
  uri: string
}
const templateImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
export default function CardNFT({ id, name, uri }: CardNFTProps) {
  return (
    <Card maxW="sm" shadow={'none'}>
      <CardBody>
        <Link
          as={NextLink}
          href={'/nfts/' + id}
          style={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none' }}
        >
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
          />
        </Link>
        <Stack mt="6" spacing="2">
          <Heading size="base">{!!name ? name : '-'}</Heading>
          <Text fontSize="sm">{id}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
