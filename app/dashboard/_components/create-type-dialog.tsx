'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FiPlus } from 'react-icons/fi';
import { toast } from 'sonner';

import { getIcon } from '@/components/icon-map';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { createTypeAction } from '@/lib/actions/dashboard/create-type-action';
import {
  CONTENT_TYPES,
  LANGUAGE_TYPES,
  TYPE_OPTIONS,
} from '@/lib/constants/type';
import { createTypeSchema, type CreateTypeSchema } from '@/schema/dashboard';

const DEFAULT_VALUES: CreateTypeSchema = {
  type: 'snippet',
  title: '',
  description: '',
  content: '',
  url: '',
  language: '',
  tags: [],
};

const CreateTypeDialog = () => {
  const [open, setOpen] = useState(false);
  const [tagsText, setTagsText] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateTypeSchema>({
    resolver: zodResolver(createTypeSchema),
    defaultValues: DEFAULT_VALUES,
  });

  // eslint-disable-next-line
  const type = watch('type');
  const showContent = CONTENT_TYPES.includes(type);
  const showLanguage = LANGUAGE_TYPES.includes(type);
  const showUrl = type === 'link';

  useEffect(() => {
    if (!showContent) setValue('content', '');
    if (!showLanguage) setValue('language', '');
    if (!showUrl) setValue('url', '');
  }, [type, showContent, showLanguage, showUrl, setValue]);

  const closeAndReset = () => {
    setOpen(false);
    reset(DEFAULT_VALUES);
    setTagsText('');
  };

  const onSubmit = async (values: CreateTypeSchema) => {
    const result = await createTypeAction({
      ...values,
      description: values.description?.trim() ? values.description : null,
      content: values.content?.trim() ? values.content : null,
      language: values.language?.trim() ? values.language : null,
      url: values.url?.trim() ? values.url : null,
    });

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
        <Button className='hidden md:inline-flex'>
          <FiPlus />
          New Item
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-lg gap-6'>
        <DialogHeader>
          <DialogTitle>Create Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='create-type'>Type</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id='create-type' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='border'>
                    {TYPE_OPTIONS.map((option) => {
                      const Icon = getIcon(option.value);
                      return (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='py-1.5 px-2'
                        >
                          <Icon />
                          {option.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            name='title'
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor='create-title'>
                  Title <span className='text-destructive'>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  id='create-title'
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
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='create-description'>
                  Description
                </FieldLabel>
                <Textarea
                  {...field}
                  value={field.value ?? ''}
                  id='create-description'
                  rows={3}
                />
              </Field>
            )}
          />

          {showContent && (
            <Controller
              name='content'
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor='create-content'>Content</FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value ?? ''}
                    id='create-content'
                    rows={6}
                    className='font-mono text-xs'
                  />
                </Field>
              )}
            />
          )}

          {showLanguage && (
            <Controller
              name='language'
              control={control}
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor='create-language'>Language</FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='create-language'
                    placeholder='e.g. typescript'
                  />
                </Field>
              )}
            />
          )}

          {showUrl && (
            <Controller
              name='url'
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor='create-url'>
                    URL <span className='text-destructive'>*</span>
                  </FieldLabel>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    id='create-url'
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}

          <Controller
            name='tags'
            control={control}
            render={() => (
              <Field>
                <FieldLabel htmlFor='create-tags'>Tags</FieldLabel>
                <Input
                  id='create-tags'
                  value={tagsText}
                  onChange={(e) => {
                    setTagsText(e.target.value);
                    setValue(
                      'tags',
                      e.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    );
                  }}
                  placeholder='react, hooks, frontend'
                />
                <small className='text-muted-foreground block text-right'>
                  Separate tags with commas
                </small>
              </Field>
            )}
          />

          <DialogFooter>
            <Button type='submit' disabled={isSubmitting} className='min-w-32'>
              {isSubmitting ? <Spinner /> : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTypeDialog;
