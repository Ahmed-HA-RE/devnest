'use client';

import Link from 'next/link';
import { FaRegFolderOpen, FaStar } from 'react-icons/fa6';

import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

type SidebarFavoriteCollectionProps = {
  id: string;
  name: string;
};

const SidebarFavoriteCollection = ({
  id,
  name,
}: SidebarFavoriteCollectionProps) => {
  const { state } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={name}>
        <Link href={`/collections/${id}`}>
          {state === 'collapsed' ? (
            <FaRegFolderOpen />
          ) : (
            <>
              <span>{name}</span>
              <FaStar className='ml-auto text-yellow-500' />
            </>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarFavoriteCollection;
