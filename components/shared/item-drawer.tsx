'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  FaCopy,
  FaPen,
  FaStar,
  FaThumbtack,
  FaTrashCan,
  FaXmark,
} from 'react-icons/fa6';
import { IoMdDownload } from 'react-icons/io';

import { getIcon } from '@/components/icon-map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useItem } from '@/hooks/use-item';
import type { ItemDetail } from '@/lib/actions/dashboard/get-items-action';
import {
  FILE_UPLOAD_TYPES,
  LANGUAGE_TYPES,
  MARKDOWN_TYPES,
} from '@/lib/constants/type';
import CodeEditor from './code-editor';
import ItemDeleteDialog from './item-delete-dialog';
import ItemDrawerSkeleton from './item-drawer-skeleton';
import ItemEditForm from './item-edit-form';
import MarkdownEditor from './markdown-editor';

const renderTypeIcon = (item: ItemDetail) => {
  const Icon = getIcon(item.type.name);
  return (
    <Icon className='size-5' style={{ color: item.type.color ?? undefined }} />
  );
};

const ItemDrawer = ({
  itemId,
  open,
  onOpenChange,
}: {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const {
    data: item,
    isLoading,
    status,
    error,
  } = useItem(itemId, open);

  const handleOpenChange = (next: boolean) => {
    if (!next) setIsEditing(false);
    onOpenChange(next);
  };

  return (
    <Drawer direction='right' open={open} onOpenChange={handleOpenChange}>
      <DrawerContent className='gap-0 data-[vaul-drawer-direction=right]:w-4/5 data-[vaul-drawer-direction=right]:sm:max-w-xl'>
        {isLoading && <ItemDrawerSkeleton />}

        {!isLoading && status === 'error' && (
          <div className='flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground'>
            {error?.message ?? 'Failed to load item.'}
          </div>
        )}

        {!isLoading && item && (
          <>
            <DrawerHeader>
              <div className='flex items-center justify-between gap-2'>
                <DrawerTitle asChild>
                  <div className='flex min-w-0 items-center gap-3'>
                    <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted'>
                      {renderTypeIcon(item)}
                    </div>
                    <span className='truncate text-lg font-semibold'>
                      {item.title}
                    </span>
                  </div>
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant='ghost' size='icon' aria-label='Close'>
                    <FaXmark />
                  </Button>
                </DrawerClose>
              </div>
              <DrawerDescription asChild>
                <div className='flex flex-wrap gap-2 pt-2'>
                  <Badge variant='secondary'>{item.type.name}</Badge>
                  {item.tags.map(({ tag }) => (
                    <Badge key={tag.name} variant='outline'>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </DrawerDescription>
            </DrawerHeader>

            {isEditing ? (
              <ItemEditForm
                item={item}
                onCancel={() => setIsEditing(false)}
                onSaved={() => setIsEditing(false)}
              />
            ) : (
              <>
                <div className='flex items-center gap-1 border-y px-4 py-2'>
                  <Button variant='ghost' size='sm'>
                    <FaStar
                      className={
                        item.isFavorite ? 'text-yellow-500' : undefined
                      }
                    />
                    Favorite
                  </Button>
                  <Button variant='ghost' size='sm'>
                    <FaThumbtack />
                    Pin
                  </Button>
                  <Button variant='ghost' size='sm'>
                    <FaCopy />
                    Copy
                  </Button>
                  {FILE_UPLOAD_TYPES.includes(item.type.name) && item.fileUrl && (
                    <Button variant='ghost' size='sm' asChild>
                      <a
                        href={item.fileUrl.replace('/upload/', '/upload/fl_attachment/')}
                        download={item.fileName ?? item.title}
                      >
                        <IoMdDownload />
                        Download
                      </a>
                    </Button>
                  )}
                  <div className='ml-auto flex items-center gap-1'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setIsEditing(true)}
                    >
                      <FaPen />
                      Edit
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-red-500 hover:text-red-500'
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <FaTrashCan />
                      Delete
                    </Button>
                  </div>
                </div>

                <div
                  data-vaul-no-drag=''
                  style={{ userSelect: 'text' }}
                  className='flex flex-col gap-6 overflow-y-auto px-4 py-4'
                >
                  {item.description && (
                    <section>
                      <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                        Description
                      </h3>
                      <p className='text-sm'>{item.description}</p>
                    </section>
                  )}

                  {item.content && (
                    <section>
                      <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                        Content
                      </h3>
                      {LANGUAGE_TYPES.includes(item.type.name) ? (
                        <CodeEditor
                          value={item.content}
                          language={item.language}
                          readOnly
                        />
                      ) : MARKDOWN_TYPES.includes(item.type.name) ? (
                        <MarkdownEditor value={item.content} readOnly />
                      ) : (
                        <pre className='overflow-x-auto rounded-md bg-muted p-3 text-xs'>
                          <code>{item.content}</code>
                        </pre>
                      )}
                    </section>
                  )}

                  {item.url && (
                    <section>
                      <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                        URL
                      </h3>
                      <a
                        href={item.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm text-primary underline-offset-4 hover:underline'
                      >
                        {item.url}
                      </a>
                    </section>
                  )}

                  {item.fileUrl && (
                    <section>
                      <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                        {item.type.name === 'image' ? 'Image' : 'File'}
                      </h3>
                      {item.type.name === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.fileUrl}
                          alt={item.fileName ?? item.title}
                          className='max-h-64 w-full rounded-md object-contain'
                        />
                      ) : (
                        <a
                          href={item.fileUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm text-primary underline-offset-4 hover:underline'
                        >
                          {item.fileName ?? item.fileUrl}
                        </a>
                      )}
                    </section>
                  )}

                  {item.collection && (
                    <section>
                      <h3 className='mb-1 text-sm font-medium text-muted-foreground'>
                        Collection
                      </h3>
                      <Badge variant='secondary'>{item.collection.name}</Badge>
                    </section>
                  )}

                  <section className='grid grid-cols-2 gap-4 text-sm'>
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
              </>
            )}

            <ItemDeleteDialog
              itemId={item.id}
              itemName={item.title}
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              onDeleted={() => handleOpenChange(false)}
            />
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default ItemDrawer;
