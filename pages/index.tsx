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
      <Spinner />
    </Container>
  );
}
