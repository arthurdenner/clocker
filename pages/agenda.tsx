import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useFetch } from '@refetty/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  IconButton,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { addDays, format, subDays } from 'date-fns';
import { getIdToken } from './../config/firebase/client';
import { useAuth } from '../components/Auth';
import { Logo } from '../components/Logo';
import { formatDate } from '../components/Date';

interface AgendaBlock {
  date: string;
  name: string;
  phone: string;
  time: string;
}

const getAgenda = async (when: Date) => {
  const token = await getIdToken();

  return axios({
    method: 'get',
    url: '/api/agenda',
    params: { date: format(when, 'yyyy-MM-dd') },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const Header = ({ children }) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
);

const AgendaBlock = ({ time, name, phone, ...props }) => (
  <Box
    {...props}
    display="flex"
    bg="gray.100"
    borderRadius={8}
    p={4}
    alignItems="center"
  >
    <Box flex={1}>{time}</Box>
    <Box textAlign="right">
      <Text fontSize="2xl">{name}</Text>
      <Text>{phone}</Text>
    </Box>
  </Box>
);

export default function Agenda() {
  const [data, { loading }, fetchAgenda] = useFetch(getAgenda, { lazy: true });
  const [when, setWhen] = useState(() => new Date());
  const [auth, { logout }] = useAuth();
  const router = useRouter();

  const addDay = () => setWhen(prevWhen => addDays(prevWhen, 1));
  const removeDay = () => setWhen(prevWhen => subDays(prevWhen, 1));

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    fetchAgenda(when);
  }, [auth.loading, fetchAgenda, when]);

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      router.push('/');
    }
  }, [auth.loading, auth.user, router]);

  return (
    <Container>
      <Header>
        <Logo size={150} />
        <Button onClick={logout}>Logout</Button>
      </Header>

      <Box mt={8} display="flex" alignItems="center">
        <IconButton
          aria-label="Go to previous day"
          icon={<ChevronLeftIcon />}
          bg="transparent"
          onClick={removeDay}
        />
        <Box flex={1} textAlign="center">
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton
          aria-label="Go to next day"
          icon={<ChevronRightIcon />}
          bg="transparent"
          onClick={addDay}
        />
      </Box>

      {loading ? (
        <Box display="flex" alignItems="center" justifyContent="center" p={4}>
          <Spinner
            color="blue.500"
            emptyColor="gray.200"
            size="xl"
            speed="0.65s"
            thickness="4px"
          />
        </Box>
      ) : null}

      {!loading && !data?.length ? (
        <Box p={4}>
          <Text textAlign="center">
            You don&apos;t have booked times for this day
          </Text>
        </Box>
      ) : null}

      {data?.map((doc: AgendaBlock) => (
        <AgendaBlock
          key={doc.time}
          time={doc.time}
          name={doc.name}
          phone={doc.phone}
          mt={4}
        />
      ))}
    </Container>
  );
}
