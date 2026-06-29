'use client';

import { format } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { FaRegSave } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { updateItemAction } from '@/lib/actions/dashboard/update-item-action';
import type { ItemDetail } from '@/lib/actions/dashboard/get-items-action';
import { CONTENT_TYPES, LANGUAGE_TYPES } from '@/lib/constants/type';
import CodeEditor from './code-editor';

type ItemEditFormValues = {
  title: string;
  description: string;
  content: string;
  language: string;
  url: string;
  tagsInput: string;
};

const ItemEditForm = ({
  item,
  onCancel,
  onSaved,
}: {
  item: ItemDetail;
  onCancel: () => void;
  onSaved: () => void;
}) => {
  const queryClient = useQueryClient();
  const showContent = CONTENT_TYPES.includes(item.type.name);
  const showLanguage = LANGUAGE_TYPES.includes(item.type.name);
  const showUrl = item.type.name === 'link';

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<ItemEditFormValues>({
    defaultValues: {
      title: item.title,
      description: item.description ?? '',
      content: item.content ?? '',
      language: item.language ?? '',
      url: item.url ?? '',
      tagsInput: item.tags.map(({ tag }) => tag.name).join(', '),
    },
  });

  //  eslint-disable-next-line
  const title = watch('title');
  const language = watch('language');

  const onSubmit = async (values: ItemEditFormValues) => {
    const tags = values.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const result = await updateItemAction(item.id, {
      title: values.title,
      description: values.description || null,
      content: showContent ? values.content || null : null,
      language: showLanguage ? values.language || null : null,
      url: showUrl ? values.url || null : null,
      tags,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['item', item.id] });
    toast.success(result.message);
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='contents'>
      <div className='flex items-center gap-1 border-y px-4 py-2'>
        <Button
          type='submit'
          size='sm'
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? (
            <>
              <Spinner className='size-3' />
              Saving
            </>
          ) : (
            <>
              <FaRegSave />
              Save
            </>
          )}
        </Button>
        <div className='ml-auto'>
          <Button type='button' variant='ghost' size='sm' onClick={onCancel}>
            <IoMdClose />
            Cancel
          </Button>
        </div>
      </div>

      <div
        data-vaul-no-drag=''
        style={{ userSelect: 'text' }}
        className='flex flex-col gap-4 overflow-y-auto px-4 py-4'
      >
        <Controller
          name='title'
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor='edit-title'>
                Title <span className='text-destructive'>*</span>
              </FieldLabel>
              <Input
                {...field}
                id='edit-title'
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor='edit-description'>Description</FieldLabel>
              <Textarea {...field} id='edit-description' rows={3} />
            </Field>
          )}
        />

        {showContent && (
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='edit-content'>Content</FieldLabel>
                {showLanguage ? (
                  <CodeEditor
                    value={field.value}
                    onChange={field.onChange}
                    language={language}
                  />
                ) : (
                  <Textarea
                    {...field}
                    id='edit-content'
                    rows={6}
                    className='font-mono text-xs'
                  />
                )}
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
                <FieldLabel htmlFor='edit-language'>Language</FieldLabel>
                <Input
                  {...field}
                  id='edit-language'
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
                <FieldLabel htmlFor='edit-url'>URL</FieldLabel>
                <Input
                  {...field}
                  id='edit-url'
                  aria-invalid={fieldState.invalid}
                />
              </Field>
            )}
          />
        )}

        <Controller
          name='tagsInput'
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor='edit-tags'>Tags</FieldLabel>
              <Input
                {...field}
                id='edit-tags'
                placeholder='react, hooks, frontend'
              />
              <FieldDescription>Separate tags with commas</FieldDescription>
            </Field>
          )}
        />

        <section className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <h3 className='mb-1 text-xs font-medium text-muted-foreground'>
              Type
            </h3>
            <Badge variant='secondary'>{item.type.name}</Badge>
          </div>
          {item.collection && (
            <div>
              <h3 className='mb-1 text-xs font-medium text-muted-foreground'>
                Collection
              </h3>
              <Badge variant='secondary'>{item.collection.name}</Badge>
            </div>
          )}
          <div>
            <h3 className='mb-1 text-xs font-medium text-muted-foreground'>
              Created
            </h3>
            <p>{format(item.createdAt, 'MMM d, yyyy')}</p>
          </div>
          <div>
            <h3 className='mb-1 text-xs font-medium text-muted-foreground'>
              Updated
            </h3>
            <p>{format(item.updatedAt, 'MMM d, yyyy')}</p>
          </div>
        </section>
      </div>
    </form>
  );
};

export default ItemEditForm;
