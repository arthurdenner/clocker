import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Spinner } from '@chakra-ui/react';
import { useAuth } from './../components/Auth';

export default function Home() {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading) {
      router.push(auth.user ? '/agenda' : '/login');
    }
  }, [auth.loading, auth.user, router]);

  return (
    <Container p={4} centerContent>
      <Spinner
        color="blue.500"
        emptyColor="gray.200"
        size="xl"
        speed="0.65s"
        thickness="4px"
      />
    </Container>
  );
}
