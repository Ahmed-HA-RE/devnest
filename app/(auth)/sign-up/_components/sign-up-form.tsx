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
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import PasswordInput from '@/components/shared/password-input';
import AuthProviders from '@/components/shared/auth-providers';
import { authSchema, type AuthSchema } from '@/schema/auth';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface SignUpFormProps {
  callbackURL: string;
}

const SignUpForm = ({ callbackURL }: SignUpFormProps) => {
  const form = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting: isPending },
    reset,
  } = form;

  const onSubmit = async (data: AuthSchema) => {
    try {
      const { userName, email, password } = data;
      const { error } = await authClient.signUp.email({
        name: userName,
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
      toast.success('Account created! Please check your email to verify it.');
      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className='flex flex-col gap-6 px-2 md:px-6 lg:px-0'>
      <div className='flex flex-col gap-1 md:gap-2.5 items-center lg:items-start'>
        <h1 className='text-2xl md:text-4xl font-bold'>Create an account</h1>
        <FieldDescription className='text-sm md:text-base'>
          Already have an account?{' '}
          <Link
            href={`/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`}
            className='duration-200'
          >
            Log in
          </Link>
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name='userName'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='sign-up-userName'>
                  Name <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id='sign-up-userName'
                  placeholder='John Doe'
                  aria-invalid={fieldState.invalid}
                  autoComplete='name'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='sign-up-email'>
                  Email <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id='sign-up-email'
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
                <FieldLabel htmlFor='sign-up-password'>
                  Password <span className='text-destructive'>*</span>
                </FieldLabel>
                <PasswordInput
                  id='sign-up-password'
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  autoComplete='new-password'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='sign-up-confirm-password'>
                  Confirm Password <span className='text-destructive'>*</span>
                </FieldLabel>
                <PasswordInput
                  id='sign-up-confirm-password'
                  value={field.value}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  autoComplete='new-password'
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={isPending} className='min-w-32'>
              {isPending ? <Spinner /> : 'Create Account'}
            </Button>
          </Field>

          <FieldSeparator className='my-0.5'>Or continue with</FieldSeparator>

          <AuthProviders callbackURL={callbackURL} />
        </FieldGroup>
      </form>
    </div>
  );
};

export default SignUpForm;
