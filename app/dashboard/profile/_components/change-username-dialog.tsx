'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FaEdit } from 'react-icons/fa';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { authClient } from '@/lib/auth-client';
import { updateUsernameSchema, type UpdateUsernameSchema } from '@/schema/user';

interface ChangeUsernameDialogProps {
  currentName: string;
}

const ChangeUsernameDialog = ({ currentName }: ChangeUsernameDialogProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateUsernameSchema>({
    resolver: zodResolver(updateUsernameSchema),
    defaultValues: { userName: currentName },
  });

  const onSubmit = async (data: UpdateUsernameSchema) => {
    try {
      await authClient.updateUser(
        { name: data.userName },
        {
          onSuccess: () => {
            toast.success('Name updated successfully');
            setOpen(false);
            router.refresh();
          },
          onError: (context) => {
            throw new Error(context.error.message || 'Failed to update name');
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <FaEdit />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Change Your Name</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name='userName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='change-username'>Name</FieldLabel>
                  <Input
                    id='change-username'
                    value={field.value}
                    onChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
              {form.formState.isSubmitting ? <Spinner /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeUsernameDialog;
