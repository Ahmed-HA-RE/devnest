import { Metadata } from 'next';
import { Suspense } from 'react';

import PinnedItems from './_components/pinned-items';
import PinnedItemsSkeleton from './_components/pinned-items-skeleton';
import RecentCollections from './_components/recent-collections';
import RecentCollectionsSkeleton from './_components/recent-collections-skeleton';
import RecentItems from './_components/recent-items';
import RecentItemsSkeleton from './_components/recent-items-skeleton';
import StatsCards from './_components/stats-cards';
import StatsCardsSkeleton from './_components/stats-cards-skeleton';

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
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>
      <Suspense fallback={<RecentCollectionsSkeleton />}>
        <RecentCollections />
      </Suspense>
      <Suspense fallback={<PinnedItemsSkeleton />}>
        <PinnedItems />
      </Suspense>
      <Suspense fallback={<RecentItemsSkeleton />}>
        <RecentItems />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
