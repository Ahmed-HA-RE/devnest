import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { FaRegFolderOpen } from 'react-icons/fa6';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import CollectionItems from './_components/collection-items';
import CollectionItemsSkeleton from './_components/collection-items-skeleton';

type CollectionPageProps = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: CollectionPageProps): Promise<Metadata> => {
  const { id } = await params;
  const collection = await prisma.collection.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: collection?.name ?? 'Collection',
    robots: { index: false, follow: false },
  };
};

const CollectionPage = async ({ params }: CollectionPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect('/sign-in');
  }

  const { id } = await params;

  const collection = await prisma.collection.findFirst({
    where: { id, userId: session.user.id },
    select: {
      id: true,
      name: true,
      description: true,
      _count: { select: { items: true } },
    },
  });

  if (!collection) {
    return redirect('/dashboard/collections');
  }

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <FaRegFolderOpen className='size-6' />
            <h2 className='text-2xl font-semibold'>{collection.name}</h2>
          </div>
          <span className='text-sm text-muted-foreground'>
            {collection._count.items}{' '}
            {collection._count.items === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>
      <Suspense fallback={<CollectionItemsSkeleton />}>
        <CollectionItems
          userId={session.user.id}
          collectionId={collection.id}
        />
      </Suspense>
    </div>
  );
};

export default CollectionPage;
