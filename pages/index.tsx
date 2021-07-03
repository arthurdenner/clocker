import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react';
import { Logo } from '../components/Logo';

export default function Home() {
  return (
    <Container p={4} centerContent>
      <Logo />
      <Box p={12}>
        <Text>Create your shared agenda</Text>
      </Box>

      <Box>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>E-mail</FormLabel>
          <Input size="lg" type="email" />
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Password</FormLabel>
          <Input size="lg" type="password" />
        </FormControl>

        <FormControl id="username" p={4} isRequired>
          <InputGroup size="lg">
            <InputLeftAddon children="clocker.work/" />
            <Input type="username" />
          </InputGroup>
        </FormControl>

        <Box p={4}>
          <Button colorScheme="blue" width="100%">
            Sign up
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
