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
import { isURL, getTemplateImage } from '@/utils/helpers'
import { MouseEventHandler, useState } from 'react'

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
  const [uriImage, setUriImage] = useState(uri)

  const setTemplateImage = () => {
    setUriImage(getTemplateImage())
  }

  return (
    <Card maxW="sm" shadow={'none'} borderWidth={1} borderColor={'orange.500'}>
      <CardBody>
        <Box position={'relative'}>
          <Image
            src={isURL(uriImage) ? uriImage : getTemplateImage()}
            alt={id}
            borderRadius="lg"
            h={200}
            w={200}
            transition={'all 0.5s ease-in-out'}
            _hover={{
              transform: 'scale(1.1,1.1)',
            }}
            cursor={'pointer'}
            objectFit={'cover'}
            onClick={onClick}
            onError={setTemplateImage}
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
