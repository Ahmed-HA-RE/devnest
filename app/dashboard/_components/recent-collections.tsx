import Link from 'next/link';
import { FaRegFolderOpen, FaStar } from 'react-icons/fa6';

import { getIcon } from '@/components/icon-map';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getBorderColor, getTextColor } from '@/lib/colors';
import { collections, items, itemTypes } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const RECENT_COLLECTIONS_COUNT = 6;

const recentCollections = [...collections]
  .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
  .slice(0, RECENT_COLLECTIONS_COUNT);

const RecentCollections = () => {
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
        {recentCollections.map((collection) => {
          const types = [
            ...new Set(
              items
                .filter((item) => item.collectionId === collection.id)
                .map((item) => item.typeId),
            ),
          ].map((typeId) => itemTypes.find((type) => type.id === typeId));

          return (
            <Card
              key={collection.id}
              className={cn('border-l-4', getBorderColor(collection.color))}
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
                  {collection.itemCount} items
                </p>
                <p className='mt-1 text-sm text-muted-foreground'>
                  {collection.description}
                </p>
                {types.length > 0 && (
                  <div className='mt-3 flex gap-2'>
                    {types.map((type) => {
                      const TypeIcon = getIcon(type?.icon ?? 'folder');
                      const { className, style } = getTextColor(type?.color);
                      return (
                        <TypeIcon
                          key={type?.id}
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
