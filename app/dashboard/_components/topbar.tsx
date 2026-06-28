import { FiFolderPlus, FiSearch } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import CreateTypeDialog from './create-type-dialog';
import ThemeToggle from './theme-toggle';

const Topbar = () => {
  return (
    <header className='flex items-center justify-between gap-2 border-b px-4 py-3 sm:gap-4 sm:px-6'>
      <SidebarTrigger />
      <div className='relative max-w-sm flex-1'>
        <FiSearch className='pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          type='search'
          placeholder='Search items...'
          className='pl-8 pr-12'
        />
        <kbd className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden rounded border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:block'>
          ⌘ K
        </kbd>
      </div>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <Button variant='outline' className='hidden md:inline-flex'>
          <FiFolderPlus />
          New Collection
        </Button>
        <CreateTypeDialog />
      </div>
    </header>
  );
};

export default Topbar;
