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
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Dashboard',
  description:
    'Your personalized developer dashboard for commands, snippets, notes, and resources.',
  robots: {
    index: false,
    follow: false,
  },
};

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const userId = session.user.id;

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-semibold'>Dashboard</h2>
        <p className='text-sm text-muted-foreground'>
          Your developer knowledge hub
        </p>
      </div>
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards userId={userId} />
      </Suspense>
      <Suspense fallback={<RecentCollectionsSkeleton />}>
        <RecentCollections userId={userId} />
      </Suspense>
      <Suspense fallback={<PinnedItemsSkeleton />}>
        <PinnedItems userId={userId} />
      </Suspense>
      <Suspense fallback={<RecentItemsSkeleton />}>
        <RecentItems userId={userId} />
      </Suspense>
    </div>
  );
};

export default DashboardPage;
