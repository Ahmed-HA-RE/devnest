import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsCardsSkeleton = () => (
  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
    {Array.from({ length: 4 }).map((_, i) => (
      <Card key={i}>
        <CardContent className='flex items-center justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-4 w-28' />
            <Skeleton className='h-8 w-12' />
          </div>
          <Skeleton className='size-10 rounded-lg' />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default StatsCardsSkeleton;
