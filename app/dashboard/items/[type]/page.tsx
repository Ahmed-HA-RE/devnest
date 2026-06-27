import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { auth } from '@/lib/auth';
import ItemsGrid from './_components/items-grid';
import ItemsGridSkeleton from './_components/items-grid-skeleton';

type ItemTypePageProps = {
  params: Promise<{ type: string }>;
};

export const generateMetadata = async ({
  params,
}: ItemTypePageProps): Promise<Metadata> => {
  const { type } = await params;
  const label = `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;

  return {
    title: label,
    robots: { index: false, follow: false },
  };
};

const ItemTypePage = async ({ params }: ItemTypePageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const { type } = await params;
  const label = `${type.charAt(0).toUpperCase()}${type.slice(1)}s`;

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h2 className='text-2xl font-semibold'>{label}</h2>
        <p className='text-sm text-muted-foreground'>
          Browse your {label.toLowerCase()}
        </p>
      </div>
      <Suspense fallback={<ItemsGridSkeleton />}>
        <ItemsGrid userId={session.user.id} type={type} />
      </Suspense>
    </div>
  );
};

export default ItemTypePage;