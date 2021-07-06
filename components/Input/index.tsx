import { ChangeEvent } from 'react';
import { mask, unMask } from 'remask';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input as InputBase,
} from '@chakra-ui/react';

export const Input = ({
  error,
  touched,
  label,
  onChange,
  mask: pattern,
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const unmaskedValue = unMask(event.target.value);
    const maskedValue = mask(unmaskedValue, pattern);

    onChange(event.target.name)(maskedValue);
  };

  return (
    <FormControl id={props.name} p={4} isRequired>
      <FormLabel>{label} </FormLabel>
      <InputBase {...props} onChange={pattern ? handleChange : onChange} />
      {touched ? (
        <FormHelperText textColor="#e74c3c">{error}</FormHelperText>
      ) : null}
    </FormControl>
  );
};
