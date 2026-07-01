import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/lib/auth';
import CollectionsGrid from './_components/collections-grid';
import CollectionsGridSkeleton from './_components/collections-grid-skeleton';

export const metadata: Metadata = {
  title: 'Collections',
  robots: { index: false, follow: false },
};

const CollectionsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/sign-in');
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-semibold'>Collections</h2>
        <p className='text-sm text-muted-foreground'>
          Browse and manage your collections
        </p>
      </div>
      <Suspense fallback={<CollectionsGridSkeleton />}>
        <CollectionsGrid userId={session.user.id} />
      </Suspense>
    </div>
  );
};

export default CollectionsPage;
