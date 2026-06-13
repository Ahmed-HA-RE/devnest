import Link from 'next/link';
import { getIcon } from '@/components/icon-map';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { collections, itemTypes } from '@/lib/mock-data';
import { FaStar } from 'react-icons/fa6';
import SidebarUserDropdown from './sidebar-user-dropdown';
import Image from 'next/image';

const logoStyles = { width: 20, height: 50 };

const RECENT_COLLECTIONS_COUNT = 3;

const favoriteCollections = collections.filter((c) => c.isFavorite);

const recentCollections = [...collections]
  .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  .slice(0, RECENT_COLLECTIONS_COUNT);

const AppSidebar = () => {
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader className='self-start'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
              className='hover:bg-transparent [&>svg]:size-20'
            >
              <Link
                href='/dashboard'
                className='flex items-center justify-center gap-0.5'
              >
                <Image
                  src={'/svg/devnest-icon.svg'}
                  alt='DevNest'
                  width={20}
                  height={50}
                  style={logoStyles}
                />
                <span className='font-semibold group-data-[collapsible=icon]:hidden pt-2.5 text-base'>
                  DevNest
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {itemTypes.map((type) => {
                const Icon = getIcon(type.icon);
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton asChild tooltip={type.name}>
                      <Link href={`/items/${type.name.toLowerCase()}`}>
                        <Icon style={{ color: type.color }} />
                        <span>{type.name}</span>
                        <span className='ml-auto text-xs text-muted-foreground'>
                          {type.itemCount}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {favoriteCollections.map((collection) => {
                const Icon = getIcon(collection.icon);
                return (
                  <SidebarMenuItem key={collection.id}>
                    <SidebarMenuButton asChild tooltip={collection.name}>
                      <Link href={`/collections/${collection.id}`}>
                        <Icon />
                        <span>{collection.name}</span>
                        <FaStar className='ml-auto text-yellow-500' />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentCollections.map((collection) => {
                const Icon = getIcon(collection.icon);
                return (
                  <SidebarMenuItem key={collection.id}>
                    <SidebarMenuButton asChild tooltip={collection.name}>
                      <Link href={`/collections/${collection.id}`}>
                        <Icon />
                        <span>{collection.name}</span>
                        <span className='ml-auto text-xs text-muted-foreground'>
                          {collection.itemCount}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarUserDropdown />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
