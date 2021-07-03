import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Container, Text } from '@chakra-ui/react';
import { useAuth } from '../components/Auth';

export default function Agenda() {
  const [auth, { logout }] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push('/');
    }
  }, [auth.loading, auth.user, router]);

  return (
    <Container>
      <Text>Agenda</Text>
      <Button onClick={logout}>Logout</Button>
    </Container>
  );
}
