import Link from 'next/link';
import { FaRegFolderOpen, FaStar } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CURRENT_USER_ID } from '@/lib/constants/app';
import { getBorderColor, getTextColor } from '@/lib/colors';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';
import { Prisma } from '@/prisma/generated/prisma/client';

const RECENT_COLLECTIONS_COUNT = 6;

type CollectionItem = Prisma.ItemGetPayload<{
  select: {
    type: { select: { id: true; name: true; color: true } };
  };
}>;

// Returns the distinct item types in a collection and the most-used one.
const getCollectionTypeInfo = (items: CollectionItem[]) => {
  const typeCounts = new Map<string, number>();
  const types: CollectionItem['type'][] = [];

  for (const { type } of items) {
    typeCounts.set(type.id, (typeCounts.get(type.id) ?? 0) + 1);

    if (!types.some((t) => t.id === type.id)) {
      types.push(type);
    }
  }

  let primaryType: CollectionItem['type'] | null = null;
  for (const type of types) {
    const isMoreUsed =
      !primaryType ||
      (typeCounts.get(type.id) ?? 0) > (typeCounts.get(primaryType.id) ?? 0);
    if (isMoreUsed) primaryType = type;
  }

  return { types, primaryType };
};

const RecentCollections = async () => {
  const collections = await prisma.collection.findMany({
    where: { userId: CURRENT_USER_ID },
    orderBy: { createdAt: 'desc' },
    take: RECENT_COLLECTIONS_COUNT,
    include: {
      items: {
        include: {
          type: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      },
    },
  });

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
            collection.items,
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
                  {collection.items.length}{' '}
                  {collection.items.length === 1 ? 'item' : 'items'}
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
