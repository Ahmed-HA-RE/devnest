'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FiFolderPlus } from 'react-icons/fi';
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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { createCollectionAction } from '@/lib/actions/dashboard/create-collection-action';
import {
  createCollectionSchema,
  type CreateCollectionSchema,
} from '@/schema/dashboard';

const DEFAULT_VALUES: CreateCollectionSchema = {
  title: '',
  description: '',
};

const CreateCollectionDialog = () => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const closeAndReset = () => {
    setOpen(false);
    reset(DEFAULT_VALUES);
  };

  const onSubmit = async (values: CreateCollectionSchema) => {
    const result = await createCollectionAction(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    closeAndReset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => (value ? setOpen(true) : closeAndReset())}
    >
      <DialogTrigger asChild>
        <Button variant='outline' className='hidden md:inline-flex'>
          <FiFolderPlus />
          New Collection
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg gap-6'>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription className='hidden' />
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <Controller
            name='title'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='collection-title'>
                  Title <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id='collection-title'
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name='description'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='collection-description'>
                  Description <span className='text-destructive'>*</span>
                </FieldLabel>
                <Textarea
                  {...field}
                  id='collection-description'
                  rows={4}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <DialogFooter>
            <Button type='submit' disabled={isSubmitting} className='min-w-32'>
              {isSubmitting ? <Spinner /> : 'Create Collection'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollectionDialog;
