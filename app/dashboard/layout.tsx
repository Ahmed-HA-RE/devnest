import { Suspense } from 'react';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './_components/app-sidebar';
import AppSidebarSkeleton from './_components/app-sidebar-skeleton';
import Topbar from './_components/topbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebarSkeleton />}>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <Topbar />
        <main className='flex-1 p-8'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
