import Link from 'next/link';
import { FaRegFolderOpen, FaStar } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import EmptyState from '@/components/shared/empty-state';
import { getBorderColor, getTextColor } from '@/lib/colors';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';

const RECENT_COLLECTIONS_COUNT = 6;

type CollectionType = { id: string; name: string; color: string | null };
type CollectionTypeCount = { type: CollectionType; count: number };

// Returns the distinct item types in a collection and the most-used one.
const getCollectionTypeInfo = (typeCounts: CollectionTypeCount[]) => {
  const types = typeCounts.map(({ type }) => type);

  let primaryType: CollectionType | null = null;
  let primaryCount = 0;
  for (const { type, count } of typeCounts) {
    if (!primaryType || count > primaryCount) {
      primaryType = type;
      primaryCount = count;
    }
  }

  return { types, primaryType };
};

const RecentCollections = async ({ userId }: { userId: string }) => {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: RECENT_COLLECTIONS_COUNT,
    include: {
      _count: { select: { items: true } },
      items: {
        select: { type: { select: { id: true, name: true, color: true } } },
      },
    },
  });

  const typeCountsByCollection = new Map<string, CollectionTypeCount[]>();
  for (const collection of collections) {
    const countMap = new Map<string, { type: CollectionType; count: number }>();
    for (const item of collection.items) {
      const { type } = item;
      const entry = countMap.get(type.id);
      if (entry) {
        entry.count += 1;
      } else {
        countMap.set(type.id, { type, count: 1 });
      }
    }
    typeCountsByCollection.set(collection.id, [...countMap.values()]);
  }

  return (
    <section>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-sm font-medium text-muted-foreground'>
          Recent Collections
        </h3>
        <Link
          href='/collections'
          className='text-sm text-muted-foreground hover:text-foreground'
        >
          View all
        </Link>
      </div>
      {collections.length === 0 ? (
        <EmptyState
          icon={FaRegFolderOpen}
          title='No collections yet'
          description='Create a collection to start organizing your items.'
        />
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {collections.map((collection) => {
            const { types, primaryType } = getCollectionTypeInfo(
              typeCountsByCollection.get(collection.id) ?? [],
            );

            const { className: borderClassName, style: borderStyle } =
              getBorderColor(primaryType?.color ?? undefined);

            return (
              <Card
                key={collection.id}
                className={cn('border-l-4', borderClassName)}
                style={borderStyle}
              >
                <CardHeader className='flex-row items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <FaRegFolderOpen />
                    <span className='font-medium'>{collection.name}</span>
                    {collection.isFavorite && (
                      <FaStar className='size-3 text-yellow-500' />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-muted-foreground'>
                    {collection._count.items}{' '}
                    {collection._count.items === 1 ? 'item' : 'items'}
                  </p>
                  {collection.description && (
                    <p className='mt-1 text-sm text-muted-foreground'>
                      {collection.description}
                    </p>
                  )}
                  {types.length > 0 && (
                    <div className='mt-3 flex gap-2'>
                      {types.map((type) => {
                        const TypeIcon = getIcon(type.name);
                        const { className, style } = getTextColor(
                          type.color ?? undefined,
                        );
                        return (
                          <TypeIcon
                            key={type.id}
                            className={cn(
                              'size-4 text-muted-foreground',
                              className,
                            )}
                            style={style}
                          />
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default RecentCollections;
