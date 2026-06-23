'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import PasswordInput from '@/components/shared/password-input';
import AuthProviders from '@/components/shared/auth-providers';
import { signInSchema, type SignInSchema } from '@/schema/auth';
import { APP_NAME } from '@/lib/constants/app';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  callbackURL: string;
}

const SignInForm = ({ callbackURL }: SignInFormProps) => {
  const router = useRouter();
  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting: isPending },
  } = form;

  const onSubmit = async (data: SignInSchema) => {
    try {
      const { email, password, rememberMe } = data;
      const { error } = await authClient.signIn.email(
        {
          email,
          password,
          rememberMe,
        },
        {
          onError: async (context) => {
            if (
              context.error.code === 'EMAIL_NOT_VERIFIED' &&
              context.error.status === 403
            ) {
              await authClient.emailOtp.sendVerificationOtp({
                email,
                type: 'email-verification',
              });
              router.push('/verify-email?email=' + encodeURIComponent(email));
            } else {
              throw new Error(context.error.message);
            }
          },
        },
      );

      if (error) {
        return;
      }

      reset();
      toast.success('Signed in successfully');
      router.push(callbackURL);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className='flex flex-col gap-6 px-2 md:px-6 lg:px-0'>
      <div className='flex flex-col gap-1 md:gap-2.5 items-center lg:items-start'>
        <h1 className='text-2xl md:text-4xl font-bold'>Welcome Back</h1>
        <FieldDescription className='text-sm md:text-base'>
          Don&apos;t have an account?{' '}
          <Link
            href={`/sign-up?callbackURL=${encodeURIComponent(callbackURL)}`}
            className='duration-200'
          >
            Join {APP_NAME}
          </Link>
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='sign-in-email'>
                  Email <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id='sign-in-email'
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

          <Controller
            name='password'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <span className='flex items-center justify-between'>
                  <FieldLabel htmlFor='sign-in-password'>
                    Password <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Link
                    href='/forgot-password'
                    className='text-xs text-primary hover:underline'
                  >
                    Forgot Password?
                  </Link>
                </span>
                <PasswordInput
                  id='sign-in-password'
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  autoComplete='current-password'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='rememberMe'
            control={control}
            render={({ field }) => (
              <Field
                orientation='horizontal'
                className='*:data-[slot=field-label]:flex-none'
              >
                <Checkbox
                  id='sign-in-remember-me'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor='sign-in-remember-me'
                  className='cursor-pointer'
                >
                  Remember Me
                </FieldLabel>
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={isPending} className='min-w-32'>
              {isPending ? <Spinner /> : 'Sign In'}
            </Button>
          </Field>

          <FieldSeparator className='my-0.5'>Or continue with</FieldSeparator>

          <AuthProviders callbackURL={callbackURL} />
        </FieldGroup>
      </form>
    </div>
  );
};

export default SignInForm;
