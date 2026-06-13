import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from './_components/app-sidebar';
import Topbar from './_components/topbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className='flex-1 p-4'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
