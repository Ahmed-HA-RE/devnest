import { FaRegFolderOpen } from 'react-icons/fa6';

import CollectionCard, {
  type CollectionType,
} from '@/components/shared/collection-card';
import EmptyState from '@/components/shared/empty-state';
import { prisma } from '@/lib/db';

type CollectionTypeCount = { type: CollectionType; count: number };

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

const CollectionsGrid = async ({ userId }: { userId: string }) => {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { items: true } },
      items: {
        select: { type: { select: { id: true, name: true, color: true } } },
      },
    },
  });

  if (collections.length === 0) {
    return (
      <EmptyState
        icon={FaRegFolderOpen}
        title='No collections yet'
        description='Create a collection to start organizing your items.'
      />
    );
  }

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
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {collections.map((collection) => {
        const { types, primaryType } = getCollectionTypeInfo(
          typeCountsByCollection.get(collection.id) ?? [],
        );

        return (
          <CollectionCard
            key={collection.id}
            id={collection.id}
            name={collection.name}
            isFavorite={collection.isFavorite}
            description={collection.description}
            itemCount={collection._count.items}
            types={types}
            primaryType={primaryType}
          />
        );
      })}
    </div>
  );
};

export default CollectionsGrid;
