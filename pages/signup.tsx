import Link from 'next/link';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Logo } from '../components/Logo';
import { firebase, persistenceMode } from '../config/firebase';

const validationSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
  username: yup.string().required('Required'),
});

const initialValues = {
  email: '',
  password: '',
  username: '',
};

export default function Signup() {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    onSubmit: async values => {
      const auth = firebase.auth();

      auth.setPersistence(persistenceMode);

      const { user } = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      console.log(user);
    },
    initialValues,
    validationSchema,
  });

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

        <FormControl id="username" p={4} isRequired>
          <InputGroup size="lg">
            <InputLeftAddon>clocker.work/</InputLeftAddon>
            <Input
              onBlur={handleBlur}
              onChange={handleChange}
              type="username"
              value={values.username}
            />
          </InputGroup>
          {touched.username ? (
            <FormHelperText textColor="#e74c3c">
              {errors.username}
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
            Sign up
          </Button>
        </Box>
      </form>

      <Link href="/">Already have an account? Log in!</Link>
    </Container>
  );
}