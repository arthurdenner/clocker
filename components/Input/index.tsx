import { ChangeEvent, FC } from 'react';
import { mask, unMask } from 'remask';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input as InputBase,
  InputProps as InputBaseProps,
} from '@chakra-ui/react';

interface InputProps extends InputBaseProps {
  disabled?: boolean;
  error?: string;
  label?: string;
  mask?: string | string[];
  touched?: boolean;
}

export const Input: FC<InputProps> = ({
  error,
  label,
  mask: pattern,
  onChange,
  touched,
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const unmaskedValue = unMask(event.target.value);
    const maskedValue = mask(unmaskedValue, pattern);

    // TODO: Fix types
    // @ts-ignore
    onChange(event.target.name)(maskedValue);
  };

  return (
    <FormControl id={props.name} p={4} isRequired>
      <FormLabel>{label} </FormLabel>
      <InputBase {...props} onChange={pattern ? handleChange : onChange} />
      {error && touched ? (
        <FormHelperText textColor="#e74c3c">{error}</FormHelperText>
      ) : null}
    </FormControl>
  );
};
