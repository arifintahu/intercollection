import {
  Text,
  Heading,
  Card,
  CardBody,
  Stack,
  Image,
  Tag,
  Box,
  Link,
} from '@chakra-ui/react'
import { isNativeNFT, isURL } from '@/utils/helpers'
import NextLink from 'next/link'
import { templateImage } from '@/utils/helpers'

type CardCollectionProps = {
  id: string
  name: string
  description: string
  uri: string
}
export default function CardCollection({
  id,
  name,
  description,
  uri,
}: CardCollectionProps) {
  return (
    <Card maxW="sm" shadow={'none'}>
      <CardBody>
        <Box position={'relative'}>
          <Link
            as={NextLink}
            href={'/collections/' + encodeURIComponent(id)}
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
          <Tag
            position={'absolute'}
            top={1}
            left={1}
            colorScheme="orange"
            textColor={'orange.800'}
          >
            {isNativeNFT(id) ? 'Native' : 'IBC'}
          </Tag>
        </Box>
        <Stack mt="6" spacing="2">
          <Heading size="base">{!!name ? name : '-'}</Heading>
          <Text fontSize="sm">{!!description ? description : '-'}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
