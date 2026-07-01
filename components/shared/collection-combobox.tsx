'use client';

import { useState } from 'react';
import { FaCheck, FaChevronDown, FaXmark } from 'react-icons/fa6';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollections } from '@/hooks/use-collections';

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

const CollectionCombobox = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: collections, isLoading } = useCollections(search, open);

  const toggle = (id: string) => {
    onChange(
      value.includes(id) ? value.filter((v) => v !== id) : [...value, id],
    );
  };

  const remove = (id: string) => onChange(value.filter((v) => v !== id));

  const selectedNames = value
    .map((id) => collections?.find((c) => c.id === id)?.name ?? id)
    .filter(Boolean);

  return (
    <div className='flex flex-col gap-2'>
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSearch('');
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type='button'
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between font-normal'
          >
            <span className='text-muted-foreground'>
              {value.length === 0
                ? 'Select collections…'
                : `${value.length} collection${value.length > 1 ? 's' : ''} selected`}
            </span>
            <FaChevronDown className='ml-2 size-3 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-[--radix-popover-trigger-width] p-0'
          align='start'
        >
          <Command shouldFilter={false}>
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder='Search collections…'
            />
            <CommandList>
              {isLoading ? (
                <div className='flex flex-col gap-1 p-2'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className='h-7 w-full rounded-sm' />
                  ))}
                </div>
              ) : (
                <>
                  <CommandEmpty>No collections found.</CommandEmpty>
                  <CommandGroup>
                    {(collections ?? []).map((collection) => (
                      <CommandItem
                        key={collection.id}
                        value={collection.id}
                        onSelect={() => toggle(collection.id)}
                      >
                        <FaCheck
                          className={cn(
                            'mr-2 size-3',
                            value.includes(collection.id)
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {collection.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedNames.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {selectedNames.map((name, i) => (
            <Badge key={value[i]} variant='secondary' className='gap-1 pr-1'>
              {name}
              <button
                type='button'
                onClick={() => remove(value[i])}
                className='ml-0.5 rounded-sm opacity-60 hover:opacity-100'
              >
                <FaXmark className='size-2.5' />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionCombobox;
