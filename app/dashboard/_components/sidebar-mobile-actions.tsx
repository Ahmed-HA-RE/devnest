'use client';

import { FiFolderPlus, FiPlus } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  useSidebar,
} from '@/components/ui/sidebar';

const SidebarMobileActions = () => {
  const { isMobile, setOpenMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <SidebarGroup>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <Button
          variant='outline'
          className='w-full justify-start'
          onClick={() => setOpenMobile(false)}
        >
          <FiFolderPlus />
          New Collection
        </Button>
        <Button className='w-full justify-start' onClick={() => setOpenMobile(false)}>
          <FiPlus />
          New Item
        </Button>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarMobileActions;
