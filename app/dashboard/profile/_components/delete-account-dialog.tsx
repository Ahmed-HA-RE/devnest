'use client';

import { useState } from 'react';
import { toast } from 'sonner';

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
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { DELETE_ACCOUNT_CONSEQUENCES } from '@/lib/constants/app';
import { authClient } from '@/lib/auth-client';

const DELETE_CONFIRMATION_WORD = 'DELETE';

const DeleteAccountDialog = () => {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);

    try {
      await authClient.deleteUser(
        { callbackURL: '/sign-in' },
        {
          onSuccess: () => {
            toast.success('A confirmation email has been sent to your inbox.');
            setOpen(false);
            setConfirmation('');
          },
          onError: (context) => {
            throw new Error(
              context.error.message || 'Failed to send confirmation email',
            );
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setConfirmation('');
      }}
    >
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            All your data, items, and collections will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <ul className='list-disc space-y-1 pl-5 text-sm text-muted-foreground'>
          {DELETE_ACCOUNT_CONSEQUENCES.map((consequence) => (
            <li key={consequence}>{consequence}</li>
          ))}
        </ul>

        <p className='text-sm text-muted-foreground'>
          We&apos;ll send a confirmation email to your inbox — your account
          won&apos;t be deleted until you confirm via that email.
        </p>

        <Field>
          <FieldLabel htmlFor='delete-confirmation'>
            Type <span className='font-semibold'>DELETE</span> to confirm
          </FieldLabel>
          <Input
            id='delete-confirmation'
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            autoComplete='off'
          />
        </Field>

        <DialogFooter>
          <Button
            variant='destructive'
            disabled={confirmation !== DELETE_CONFIRMATION_WORD || isSubmitting}
            onClick={handleDelete}
            className='min-w-32'
          >
            {isSubmitting ? <Spinner /> : 'Send Verification'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
