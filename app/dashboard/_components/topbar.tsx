import Link from 'next/link';
import { FiFolderPlus, FiPlus, FiSearch } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from './theme-toggle';

const Topbar = () => {
  return (
    <header className='flex items-center justify-between gap-4 border-b px-6 py-3'>
      <Link href='/' className='flex items-center gap-2'>
        <div className='flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold'>
          D
        </div>
        <span className='font-semibold'>DevNest</span>
      </Link>
      <div className='relative max-w-sm flex-1'>
        <FiSearch className='pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search items...'
          className='pl-8 pr-12'
        />
        <kbd className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground'>
          ⌘ K
        </kbd>
      </div>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <Button variant='outline'>
          <FiFolderPlus />
          New Collection
        </Button>
        <Button>
          <FiPlus />
          New Item
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
