import Topbar from './_components/topbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <Topbar />
      <div className='flex flex-1'>
        <aside className='w-64 border-r p-4'>
          <h2>Sidebar</h2>
        </aside>
        <main className='flex-1 p-4'>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
