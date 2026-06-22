'use client';

import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { RiEyeCloseLine } from 'react-icons/ri';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';

interface PasswordInputProps extends Omit<
  React.ComponentProps<'input'>,
  'type'
> {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const PasswordInput = ({ value, onChange, ...props }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <InputGroup>
      <InputGroupInput
        type={isVisible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        {...props}
      />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton
          type='button'
          size='icon-xs'
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? <RiEyeCloseLine /> : <FaEye />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};

export default PasswordInput;
