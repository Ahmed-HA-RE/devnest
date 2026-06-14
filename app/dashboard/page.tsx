import { Metadata } from 'next';

import PinnedItems from './_components/pinned-items';
import RecentCollections from './_components/recent-collections';
import RecentItems from './_components/recent-items';
import StatsCards from './_components/stats-cards';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Your personalized developer dashboard for commands, snippets, notes, and resources.',
  robots: {
    index: false,
    follow: false,
  },
};

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-semibold'>Dashboard</h2>
        <p className='text-sm text-muted-foreground'>
          Your developer knowledge hub
        </p>
      </div>
      <StatsCards />
      <RecentCollections />
      <PinnedItems />
      <RecentItems />
    </div>
  );
};

export default DashboardPage;
