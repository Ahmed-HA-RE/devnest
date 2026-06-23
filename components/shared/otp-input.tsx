'use client';

import { useEffect, useId, useState } from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  resendIntervalSeconds?: number;
  onResend?: () => void;
  disabled?: boolean;
}

const OtpInput = ({
  value,
  onChange,
  maxLength = 6,
  resendIntervalSeconds = 60,
  onResend,
  disabled,
}: OtpInputProps) => {
  const id = useId();
  const [timeLeft, setTimeLeft] = useState(resendIntervalSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResend = () => {
    if (onResend) {
      onResend();
    }
    setTimeLeft(resendIntervalSeconds);
  };

  return (
    <div className='flex flex-col items-center gap-3'>
      <InputOTP
        id={id}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <InputOTPGroup>
          {Array.from({ length: maxLength }).map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p className='text-xs text-muted-foreground'>
        {timeLeft > 0 ? (
          `Resend available in ${formatTime(timeLeft)}`
        ) : (
          <Button
            type='button'
            variant='link'
            size='sm'
            onClick={handleResend}
            className='underline hover:text-primary'
          >
            Resend code
          </Button>
        )}
      </p>
    </div>
  );
};

export default OtpInput;
