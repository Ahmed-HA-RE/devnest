'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FaChevronRight } from 'react-icons/fa6';
import { MdLogout } from 'react-icons/md';
import Link from 'next/link';
import { LuUser } from 'react-icons/lu';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

// Placeholder until auth is implemented.
const currentUser = {
  name: 'John Doe',
  email: 'john@example.com',
  image: '/images/default-avatar.png',
};

const SidebarUserAvatar = () => {
  const initials = currentUser.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <>
      <Avatar>
        <AvatarImage src={currentUser.image} alt={currentUser.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-medium text-foreground'>
          {currentUser.name}
        </span>
        <span className='text-muted-foreground truncate text-xs'>
          {currentUser.email}
        </span>
      </div>
    </>
  );
};

const SidebarUserDropdown = () => {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-open:bg-sidebar-accent cursor-pointer hover:text-none'
            >
              <SidebarUserAvatar />
              <FaChevronRight className='ml-auto !size-3 transition-transform duration-200 max-lg:rotate-270 [[data-state=open]>&]:rotate-90 lg:[[data-state=open]>&]:-rotate-180' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 '
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={isMobile ? 8 : 16}
          >
            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
              <SidebarUserAvatar />
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href='/profile'>
                  <LuUser />
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' onClick={handleLogout}>
              <MdLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarUserDropdown;
