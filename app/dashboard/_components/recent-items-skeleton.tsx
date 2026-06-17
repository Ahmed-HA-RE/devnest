import { Card } from '@/components/ui/card';
import ItemRowSkeleton from './item-row-skeleton';

const RecentItemsSkeleton = () => (
  <section>
    <h3 className='mb-3 text-sm font-medium text-muted-foreground'>
      Recent Items
    </h3>
    <Card className='py-0'>
      {Array.from({ length: 10 }).map((_, i) => (
        <ItemRowSkeleton key={i} />
      ))}
    </Card>
  </section>
);

export default RecentItemsSkeleton;
