import { FiFolder, FiHeart, FiPackage, FiStar } from 'react-icons/fi';

import { Card, CardContent } from '@/components/ui/card';
import { CURRENT_USER_ID } from '@/lib/constants/app';
import { getTextColor } from '@/lib/colors';
import { prisma } from '@/lib/db';
import { cn } from '@/lib/utils';

const StatsCards = async () => {
  const [itemCount, collectionCount, favoriteItemCount, favoriteCollectionCount] =
    await Promise.all([
      prisma.item.count({ where: { userId: CURRENT_USER_ID } }),
      prisma.collection.count({ where: { userId: CURRENT_USER_ID } }),
      prisma.item.count({
        where: { userId: CURRENT_USER_ID, isFavorite: true },
      }),
      prisma.collection.count({
        where: { userId: CURRENT_USER_ID, isFavorite: true },
      }),
    ]);

  const stats = [
    {
      label: 'Items',
      value: itemCount,
      icon: FiPackage,
      color: 'blue',
    },
    {
      label: 'Collections',
      value: collectionCount,
      icon: FiFolder,
      color: 'purple',
    },
    {
      label: 'Favorite Items',
      value: favoriteItemCount,
      icon: FiHeart,
      color: 'pink',
    },
    {
      label: 'Favorite Collections',
      value: favoriteCollectionCount,
      icon: FiStar,
      color: 'yellow',
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      {stats.map(({ label, value, icon: Icon, color }) => {
        const { className, style } = getTextColor(color);

        return (
          <Card key={label}>
            <CardContent className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>{label}</p>
                <p className='text-2xl font-semibold'>{value}</p>
              </div>
              <div className='flex size-10 items-center justify-center rounded-lg bg-muted'>
                <Icon className={cn('size-5', className)} style={style} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
