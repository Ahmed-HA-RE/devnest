import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

const AppSidebarSkeleton = () => (
  <Sidebar collapsible='icon'>
    <SidebarHeader className='self-start'>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className='flex items-center gap-0.5 px-2 py-1.5'>
            <Skeleton className='size-5' />
            <Skeleton className='ml-1 h-5 w-20' />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Types</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 7 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className='flex items-center gap-2 px-2 py-1.5'>
                  <Skeleton className='size-4' />
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='ml-auto h-3 w-5' />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Collections</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {Array.from({ length: 4 }).map((_, i) => (
              <SidebarMenuItem key={i}>
                <div className='flex items-center gap-2 px-2 py-1.5'>
                  <Skeleton className='size-4' />
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='ml-auto h-3 w-4' />
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <div className='flex items-center gap-2 px-2 py-1.5'>
        <Skeleton className='size-8 rounded-lg' />
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-3 w-20' />
          <Skeleton className='h-3 w-28' />
        </div>
      </div>
    </SidebarFooter>
  </Sidebar>
);

export default AppSidebarSkeleton;
