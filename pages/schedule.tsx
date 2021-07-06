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
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { addDays, format, subDays } from 'date-fns';
import { useAuth } from '../components/Auth';
import { formatDate } from '../components/Date';
import { Logo } from '../components/Logo';
import { TimeBlock } from '../components/TimeBlock';

const getSchedule = (when: Date) =>
  axios({
    method: 'get',
    url: '/api/schedule',
    params: {
      date: format(when, 'yyyy-MM-dd'),
    },
  });

const Header = ({ children }) => (
  <Box p={4} display="flex" alignItems="center" justifyContent="space-between">
    {children}
  </Box>
);

export default function Schedule() {
  const [data, { loading }, fetchSchedule] = useFetch(getSchedule, {
    lazy: true,
  });
  const [when, setWhen] = useState(() => new Date());
  const [auth, { logout }] = useAuth();
  const router = useRouter();

  const addDay = () => setWhen(prevWhen => addDays(prevWhen, 1));
  const removeDay = () => setWhen(prevWhen => subDays(prevWhen, 1));

  useEffect(() => {
    if (auth.loading) {
      return;
    }

    fetchSchedule(when);
  }, [auth.loading, fetchSchedule, when]);

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
          bg="transparent"
          icon={<ChevronLeftIcon />}
          onClick={removeDay}
        />
        <Box flex={1} textAlign="center">
          {formatDate(when, 'PPPP')}
        </Box>
        <IconButton
          aria-label="Go to next day"
          bg="transparent"
          icon={<ChevronRightIcon />}
          onClick={addDay}
        />
      </Box>

      <SimpleGrid p={4} columns={2} spacing={4}>
        {loading ? (
          <Spinner
            color="blue.500"
            emptyColor="gray.200"
            size="xl"
            speed="0.65s"
            thickness="4px"
          />
        ) : null}

        {data?.timeBlocks?.map((time: string) => (
          <TimeBlock key={time} date={when} disabled={false} time={time} />
        ))}
      </SimpleGrid>
    </Container>
  );
}