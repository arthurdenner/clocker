import { useState, useEffect } from 'react';
import { Container, Spinner } from '@chakra-ui/react';
import { firebase } from '../config/firebase';
import { Agenda } from '../components/Agenda';
import { Login } from '../components/Login';

export default function Home() {
  const [auth, setAuth] = useState({
    loading: true,
    user: null,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setAuth({
        loading: false,
        user,
      });
    });

    return () => unsubscribe();
  }, []);

  if (auth.loading) {
    return (
      <Container p={4} centerContent>
        <Spinner />
      </Container>
    );
  }

  return auth.user ? <Agenda /> : <Login />;
}
