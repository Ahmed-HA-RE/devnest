'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/schema/auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const ForgotPasswordForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting: isPending },
  } = form;

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const { email } = data;
      await authClient.emailOtp.requestPasswordReset(
        {
          email,
        },
        {
          onSuccess: () => {
            router.push('/reset-password?email=' + encodeURIComponent(email));
          },
          onError: (context) => {
            const { error } = context;
            throw new Error(error.message);
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
        <h1 className='text-2xl md:text-4xl font-bold'>Forgot password?</h1>
        <FieldDescription className='text-sm md:text-base'>
          Enter your email and we&apos;ll send you a code to reset your
          password.
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='forgot-password-email'>
                  Email <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id='forgot-password-email'
                  type='email'
                  placeholder='m@example.com'
                  aria-invalid={fieldState.invalid}
                  autoComplete='email'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className='flex flex-col gap-2.5'>
            <Button type='submit' disabled={isPending} className='min-w-32'>
              {isPending ? <Spinner /> : 'Send Code'}
            </Button>
            <Button asChild variant='secondary'>
              <Link href='/sign-in' className=''>
                Back to Sign In
              </Link>
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
