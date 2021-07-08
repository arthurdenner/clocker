import { useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { Input } from '../Input';

const initialValues = {
  name: '',
  phone: '',
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Required'),
  phone: yup.string().required('Required'),
});

const setSchedule = async ({ date, ...data }) =>
  axios({
    method: 'post',
    url: '/api/schedule',
    data: {
      ...data,
      date: format(date, 'yyyy-MM-dd'),
      username: window.location.pathname.replace('/', ''),
    },
  });

const ModalTimeBlock = ({
  children,
  isOpen,
  isSubmitting,
  onClose,
  onComplete,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <form onSubmit={onComplete}>
        <ModalHeader>Book your time</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <ButtonGroup>
            {!isSubmitting ? (
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            ) : null}
            <Button
              colorScheme="blue"
              isLoading={isSubmitting}
              mr={3}
              type="submit"
            >
              Book time
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </form>
    </ModalContent>
  </Modal>
);

export const TimeBlock = ({ date, disabled, onAddTimeBlock, time }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(prevState => !prevState);

  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    isSubmitting,
  } = useFormik({
    onSubmit: async values => {
      try {
        await setSchedule({ ...values, time, date });
        onAddTimeBlock();
        toggle();
      } catch (error) {
        console.log(error);
      }
    },
    initialValues,
    validationSchema,
  });

  return (
    <Button colorScheme="blue" disabled={disabled} onClick={toggle} p={8}>
      {time}
      {!disabled ? (
        <ModalTimeBlock
          isOpen={isOpen}
          onClose={toggle}
          onComplete={handleSubmit}
          isSubmitting={isSubmitting}
        >
          <Input
            disabled={isSubmitting}
            error={errors.name}
            label="Name:"
            name="name"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="Your name"
            size="lg"
            touched={touched.name}
            value={values.name}
          />

          <Input
            disabled={isSubmitting}
            error={errors.phone}
            label="Phone number"
            mask={['(99) 9999-9999', '(99) 9 9999-9999']}
            mt={4}
            name="phone"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="(99) 9 9999-9999"
            size="lg"
            value={values.phone}
          />
        </ModalTimeBlock>
      ) : null}
    </Button>
  );
};
