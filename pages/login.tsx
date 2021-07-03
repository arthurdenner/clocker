import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../components/Auth';
import { Logo } from '../components/Logo';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
});

const initialValues = {
  email: '',
  password: '',
};

export default function Login() {
  const [auth, { login }] = useAuth();
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    onSubmit: login,
    initialValues,
    validationSchema,
  });

  useEffect(() => {
    if (auth.user) {
      router.push('/agenda');
    }
  }, [auth.user, router]);

  return (
    <Container p={4} centerContent>
      <Logo />
      <Box p={12}>
        <Text>Create your shared agenda</Text>
      </Box>

      <form onSubmit={handleSubmit}>
        <FormControl id="email" p={4} isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            onBlur={handleBlur}
            onChange={handleChange}
            size="lg"
            type="email"
            value={values.email}
          />
          {touched.email ? (
            <FormHelperText textColor="#e74c3c">{errors.email}</FormHelperText>
          ) : null}
        </FormControl>

        <FormControl id="password" p={4} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            onBlur={handleBlur}
            onChange={handleChange}
            size="lg"
            type="password"
            value={values.password}
          />
          {touched.password ? (
            <FormHelperText textColor="#e74c3c">
              {errors.password}
            </FormHelperText>
          ) : null}
        </FormControl>

        <Box p={4}>
          <Button
            colorScheme="blue"
            isLoading={isSubmitting}
            type="submit"
            width="100%"
          >
            Login
          </Button>
        </Box>
      </form>

      <Link href="/signup">Don&apos;t have an account? Sign up!</Link>
    </Container>
  );
}