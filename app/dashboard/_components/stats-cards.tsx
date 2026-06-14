import { FiFolder, FiHeart, FiPackage, FiStar } from 'react-icons/fi';

import { Card, CardContent } from '@/components/ui/card';
import { getTextColor } from '@/lib/colors';
import { collections, items } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const stats = [
  {
    label: 'Items',
    value: items.length,
    icon: FiPackage,
    color: 'blue',
  },
  {
    label: 'Collections',
    value: collections.length,
    icon: FiFolder,
    color: 'purple',
  },
  {
    label: 'Favorite Items',
    value: items.filter((item) => item.isFavorite).length,
    icon: FiHeart,
    color: 'pink',
  },
  {
    label: 'Favorite Collections',
    value: collections.filter((collection) => collection.isFavorite).length,
    icon: FiStar,
    color: 'yellow',
  },
];

const StatsCards = () => {
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
