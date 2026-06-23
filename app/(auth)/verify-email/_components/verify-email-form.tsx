'use client';

import Link from 'next/link';
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
import {
  emailVerificationSchema,
  type EmailVerificationSchema,
} from '@/schema/auth';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface VerifyEmailFormProps {
  email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
  const router = useRouter();
  const form = useForm<EmailVerificationSchema>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      otp: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting: isPending },
  } = form;

  const onSubmit = async (data: EmailVerificationSchema) => {
    try {
      const { otp } = data;
      const { error } = await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });
      if (error) {
        throw new Error(error.message);
      }
      toast.success('Email verified successfully');
      router.push('/sign-in');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const onResendEmailVerificationCode = async () => {
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'email-verification',
      });
      if (error) {
        throw new Error(error.message);
      }
      toast.success('Verification code resent successfully');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className='flex flex-col gap-6 px-2 md:px-6 lg:px-0'>
      <div className='flex flex-col gap-1 md:gap-2.5 items-center'>
        <h1 className='text-2xl md:text-4xl font-bold'>Verify your email</h1>
        <FieldDescription className='text-center text-sm md:text-base'>
          We have sent a verification code to{' '}
          <span className='font-medium text-foreground'>{email}</span>. Enter it
          below to continue.
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='otp'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <OtpInput
                  value={field.value}
                  onChange={field.onChange}
                  onResend={onResendEmailVerificationCode}
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
            <Button type='submit' disabled={isPending} className='min-w-32'>
              {isPending ? <Spinner /> : 'Verify Email'}
            </Button>
          </Field>

          <Field>
            <Button variant='outline' asChild>
              <Link href='/sign-in'>Back to Sign In</Link>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default VerifyEmailForm;
