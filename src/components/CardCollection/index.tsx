import { Text, Heading, Card, CardBody, Stack, Image } from '@chakra-ui/react'

type CardCollectionProps = {
  id: string
  name: string
}
export default function CardCollection({ id, name }: CardCollectionProps) {
  return (
    <Card maxW="sm" shadow={'none'}>
      <CardBody>
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt="Green double couch with wooden legs"
          borderRadius="lg"
          h={200}
          w={200}
        />
        <Stack mt="6" spacing="3">
          <Heading size="md">{!!name ? name : '-'}</Heading>
          <Text>{id}</Text>
        </Stack>
      </CardBody>
    </Card>
  )
}
