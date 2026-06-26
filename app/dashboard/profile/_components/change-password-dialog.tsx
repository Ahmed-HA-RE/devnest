'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { setPasswordAction } from '@/lib/actions/user';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Spinner } from '@/components/ui/spinner';
import PasswordInput from '@/components/shared/password-input';
import { authClient } from '@/lib/auth-client';
import {
  changeUserPassSchema,
  setUserPassSchema,
  type ChangeUserPassSchema,
  type SetUserPassSchema,
} from '@/schema/user';

interface ChangePasswordDialogProps {
  hasPassword: boolean;
  email: string;
}

const ChangePasswordForm = ({
  onSuccess,
  email,
}: {
  onSuccess: () => void;
  email: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<ChangeUserPassSchema>({
    resolver: zodResolver(changeUserPassSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangeUserPassSchema) => {
    try {
      await authClient.changePassword(
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          revokeOtherSessions: true,
        },
        {
          onSuccess: () => {
            toast.success('Password changed successfully');
            onSuccess();
          },
          onError: (context) => {
            throw new Error(
              context.error.message || 'Failed to change password',
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

  const handleResetPassword = () => {
    startTransition(async () => {
      try {
        await authClient.emailOtp.requestPasswordReset(
          {
            email,
          },
          {
            onSuccess: () => {
              toast.success('A reset email has been sent to your inbox.');
              router.push('/reset-password?email=' + encodeURIComponent(email));
            },
            onError: (context) => {
              throw new Error(
                context.error.message || 'Failed to send password reset email',
              );
            },
          },
        );
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='currentPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='current-password'>
                  Current Password
                </FieldLabel>
                <Button
                  variant='link'
                  className='text-xs text-blue-500 hover:text-blue-600 hover:underline p-0'
                  disabled={isPending}
                  onClick={() => handleResetPassword()}
                >
                  Forgot password?
                </Button>
              </div>
              <PasswordInput
                id='current-password'
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                autoComplete='current-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='newPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor='new-password'>New Password</FieldLabel>
              <PasswordInput
                id='new-password'
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                autoComplete='new-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='confirmPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor='confirm-new-password'>
                Confirm New Password
              </FieldLabel>
              <PasswordInput
                id='confirm-new-password'
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                autoComplete='new-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter className='mt-4'>
        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='min-w-32'
        >
          {form.formState.isSubmitting ? <Spinner /> : 'Change Password'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const SetPasswordForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const form = useForm<SetUserPassSchema>({
    resolver: zodResolver(setUserPassSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data: SetUserPassSchema) => {
    const result = await setPasswordAction(data);

    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name='newPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor='set-new-password'>New Password</FieldLabel>
              <PasswordInput
                id='set-new-password'
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                autoComplete='new-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='confirmPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor='set-confirm-password'>
                Confirm New Password
              </FieldLabel>
              <PasswordInput
                id='set-confirm-password'
                value={field.value}
                onChange={field.onChange}
                aria-invalid={fieldState.invalid}
                autoComplete='new-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter className='mt-4'>
        <Button
          type='submit'
          disabled={form.formState.isSubmitting}
          className='min-w-32'
        >
          {form.formState.isSubmitting ? <Spinner /> : 'Set Password'}
        </Button>
      </DialogFooter>
    </form>
  );
};

const ChangePasswordDialog = ({
  hasPassword,
  email,
}: ChangePasswordDialogProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          {hasPassword ? 'Change Password' : 'Set Password'}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg gap-6'>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            {hasPassword ? 'Change Password' : 'Set Password'}
          </DialogTitle>
          <DialogDescription className='hidden' />
        </DialogHeader>
        {hasPassword ? (
          <ChangePasswordForm onSuccess={() => setOpen(false)} email={email} />
        ) : (
          <SetPasswordForm
            onSuccess={() => {
              setOpen(false);
              router.refresh();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
