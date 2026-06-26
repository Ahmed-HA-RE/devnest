'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import OtpInput from '@/components/shared/otp-input';
import PasswordInput from '@/components/shared/password-input';
import {
  otpSchema,
  resetPasswordSchema,
  type ResetPasswordSchema,
} from '@/schema/auth';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const otpFormSchema = z.object({
  otp: otpSchema,
});

type OtpFormSchema = z.infer<typeof otpFormSchema>;

interface NewPasswordFormProps {
  email: string;
  otp: string;
  isUserLoggedIn: boolean;
}

const NewPasswordForm = ({
  email,
  otp,
  isUserLoggedIn,
}: NewPasswordFormProps) => {
  const router = useRouter();

  const passwordForm = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (data: ResetPasswordSchema) => {
    try {
      const { password } = data;
      await authClient.emailOtp.resetPassword(
        {
          email,
          password,
          otp,
        },
        {
          onSuccess: () => {
            toast.success('Password reset successfully');
            if (isUserLoggedIn) {
              router.push('/dashboard');
            } else {
              router.push('/sign-in');
            }
          },
          onError: (context) => {
            throw new Error(
              context.error.message || 'Failed to reset password',
            );
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className='flex flex-col gap-6 px-2 md:px-6 lg:px-0'>
      <div className='flex flex-col gap-1 md:gap-2.5 items-center lg:items-start'>
        <h1 className='text-2xl md:text-4xl font-bold'>Reset your password</h1>
        <FieldDescription className='text-sm md:text-base'>
          Enter a new password for your account.
        </FieldDescription>
      </div>

      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
        <FieldGroup>
          <Controller
            name='password'
            control={passwordForm.control}
            render={({ field, fieldState }) => (
              <Field>
                <PasswordInput
                  id='reset-password-password'
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  autoComplete='new-password'
                  placeholder='New password'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='confirmPassword'
            control={passwordForm.control}
            render={({ field, fieldState }) => (
              <Field>
                <PasswordInput
                  id='reset-password-confirm-password'
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  autoComplete='new-password'
                  placeholder='Confirm new password'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button
              type='submit'
              disabled={passwordForm.formState.isSubmitting}
              className='min-w-32'
            >
              {passwordForm.formState.isSubmitting ? (
                <Spinner />
              ) : (
                'Reset Password'
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

const ResetPasswordForm = ({
  email,
  isUserLoggedIn,
}: {
  email: string;
  isUserLoggedIn: boolean;
}) => {
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);
  const [otp, setOtp] = useState('');

  const otpForm = useForm<OtpFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: '',
    },
  });

  const onOtpSubmit = async (data: OtpFormSchema) => {
    try {
      const { otp } = data;
      await authClient.emailOtp.checkVerificationOtp(
        {
          email,
          type: 'forget-password',
          otp,
        },
        {
          onSuccess: () => {
            toast.success('OTP verified successfully');
            setIsOtpSuccess(true);
            setOtp(otp);
          },
          onError: (context) => {
            throw new Error(context.error.message || 'Failed to verify OTP');
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleResendOtp = async () => {
    try {
      await authClient.emailOtp.sendVerificationOtp(
        {
          email,
          type: 'forget-password',
        },
        {
          onSuccess: () => {
            toast.success('OTP sent successfully');
          },
          onError: (context) => {
            throw new Error(context.error.message || 'Failed to send OTP');
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  if (!isOtpSuccess) {
    return (
      <div className='flex flex-col gap-6 px-2 md:px-6 lg:px-0'>
        <div className='flex flex-col gap-1 md:gap-2.5 items-center'>
          <h1 className='text-2xl md:text-4xl font-bold'>Enter your code</h1>
          <FieldDescription className='text-center text-sm md:text-base'>
            We have sent a verification code to your email. Enter it below to
            continue.
          </FieldDescription>
        </div>

        <form onSubmit={otpForm.handleSubmit(onOtpSubmit)}>
          <FieldGroup>
            <Controller
              name='otp'
              control={otpForm.control}
              render={({ field, fieldState }) => (
                <Field>
                  <OtpInput
                    value={field.value}
                    onChange={field.onChange}
                    onResend={handleResendOtp}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className='text-xs text-center'
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Field>
              <Button
                type='submit'
                disabled={otpForm.formState.isSubmitting}
                className='min-w-32'
              >
                {otpForm.formState.isSubmitting ? <Spinner /> : 'Verify Code'}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    );
  }

  return (
    <NewPasswordForm email={email} otp={otp} isUserLoggedIn={isUserLoggedIn} />
  );
};

export default ResetPasswordForm;
