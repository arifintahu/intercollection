import {
  Text,
  Heading,
  Card,
  CardBody,
  Stack,
  Image,
  Tag,
  Box,
} from '@chakra-ui/react'
import { isNativeNFT, isURL } from '@/utils/helpers'

type CardCollectionProps = {
  id: string
  name: string
  description: string
  uri: string
}
const templateImage =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
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
          />
          <Tag
            position={'absolute'}
            top={1}
            right={1}
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
