import Link from 'next/link';
import { FaRegFolderOpen, FaStar } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CURRENT_USER_ID } from '@/lib/constants/app';
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

const RecentCollections = async () => {
  const collections = await prisma.collection.findMany({
    where: { userId: CURRENT_USER_ID },
    orderBy: { createdAt: 'desc' },
    take: RECENT_COLLECTIONS_COUNT,
    include: {
      _count: { select: { items: true } },
    },
  });

  const collectionIds = collections.map((collection) => collection.id);

  const itemTypeCounts = await prisma.item.groupBy({
    by: ['collectionId', 'typeId'],
    where: { collectionId: { in: collectionIds } },
    _count: { _all: true },
  });

  const types = await prisma.itemType.findMany({
    where: { id: { in: [...new Set(itemTypeCounts.map((row) => row.typeId))] } },
    select: { id: true, name: true, color: true },
  });
  const typeById = new Map(types.map((type) => [type.id, type]));

  const typeCountsByCollection = new Map<string, CollectionTypeCount[]>();
  for (const row of itemTypeCounts) {
    if (!row.collectionId) continue;
    const type = typeById.get(row.typeId);
    if (!type) continue;

    const entries = typeCountsByCollection.get(row.collectionId) ?? [];
    entries.push({ type, count: row._count._all });
    typeCountsByCollection.set(row.collectionId, entries);
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
    </section>
  );
};

export default RecentCollections;
