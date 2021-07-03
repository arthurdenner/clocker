import { Button, Container, Text } from '@chakra-ui/react';
import { firebase } from '../../config/firebase/client';

export const Agenda = () => {
  const logout = () => firebase.auth().signOut();

  return (
    <Container>
      <Text>Agenda</Text>
      <Button onClick={logout}>Logout</Button>
    </Container>
  );
};
