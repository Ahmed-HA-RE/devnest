import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegFolderOpen } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Badge } from '@/components/ui/badge';
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
import { auth } from '@/lib/auth';
import { getTextColor } from '@/lib/colors';
import { prisma } from '@/lib/db';
import SidebarFavoriteCollection from './sidebar-favorite-collection';
import SidebarMobileActions from './sidebar-mobile-actions';
import SidebarUserDropdown from './sidebar-user-dropdown';

const logoStyles = { width: 20, height: 50 };

// Display order for system item types in the sidebar.
const ITEM_TYPE_ORDER = [
  'snippet',
  'command',
  'note',
  'file',
  'prompt',
  'image',
  'link',
];

const AppSidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const userId = session.user.id;

  const [itemTypes, favoriteCollections, collections] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
      include: {
        _count: { select: { items: { where: { userId } } } },
      },
    }),
    prisma.collection.findMany({
      where: { userId, isFavorite: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { items: true } } },
    }),
  ]);

  const sortedItemTypes = [...itemTypes].sort(
    (a, b) => ITEM_TYPE_ORDER.indexOf(a.name) - ITEM_TYPE_ORDER.indexOf(b.name),
  );

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
        <SidebarMobileActions />

        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sortedItemTypes.map((type) => {
                const Icon = getIcon(type.name);
                const { className, style } = getTextColor(
                  type.color ?? undefined,
                );
                return (
                  <SidebarMenuItem key={type.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={`${type.name.charAt(0).toUpperCase()}${type.name.slice(1)}s`}
                    >
                      <Link href={`/dashboard/items/${type.name}`}>
                        <Icon className={className} style={style} />
                        <span className='capitalize'>{type.name}s</span>
                        {(type.name === 'image' || type.name === 'file') && (
                          <Badge className='pro-badge ml-1 border-0 px-1.5 py-0 text-[10px] font-semibold tracking-wider group-data-[collapsible=icon]:hidden'>
                            PRO
                          </Badge>
                        )}
                        <span className='ml-auto text-xs text-muted-foreground'>
                          {type._count.items}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {favoriteCollections.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favoriteCollections.map((collection) => (
                  <SidebarFavoriteCollection
                    key={collection.id}
                    id={collection.id}
                    name={collection.name}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <div className='flex items-center justify-between'>
            <SidebarGroupLabel>Collections</SidebarGroupLabel>
            <Link
              href='/collections'
              className='text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden mr-2'
            >
              View all
            </Link>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((collection) => {
                return (
                  <SidebarMenuItem key={collection.id}>
                    <SidebarMenuButton asChild tooltip={collection.name}>
                      <Link href={`/collections/${collection.id}`}>
                        <FaRegFolderOpen />
                        <span>{collection.name}</span>
                        <span className='ml-auto text-xs text-muted-foreground'>
                          {collection._count.items}
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
        <SidebarUserDropdown
          name={session.user.name}
          email={session.user.email}
          image={session.user.image}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
